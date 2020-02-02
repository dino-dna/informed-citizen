import { PoolClient } from 'pg'
import { from, Observable, of, Subject } from 'rxjs'
import { delayWhen, filter, finalize, map, mergeMap, tap } from 'rxjs/operators'
import WebSocket from 'ws'
import { AnalysisResult } from '../common'
import { Config } from '../config'
import { Services } from '../services'
import { toUrlKey } from '../util/analysis'
import { requestAnalysis, scrapeReport } from '../util/report'

export interface AnalyzeOptions {
  config: Config
  db: PoolClient
  logger: Services['logger'],
  requestedUrl: string
}
export async function analyze ({
  config,
  db,
  logger,
  requestedUrl
}: AnalyzeOptions) {
  const scrapeResult = await scrapeReport({ scraperApiEndpoint: config.scraperApiEndpoint, reportUrl: requestedUrl })
  const resolvedKey = toUrlKey({ url: scrapeResult.url })
  const existingAnalyses = await db.query('select id from analyses where scraped_urlkey = $1', [resolvedKey])
  if (existingAnalyses.rowCount) {
    return logger.info(`skipping analysis on resolved key: ${resolvedKey}`)
  }
  const report = await requestAnalysis({ analyzerApiEndpoint: config.analyzerApiEndpoint, scrapeResult })
  try {
    logger.info(`commiting ${report.url} to db`)
    await db.query('begin')
    await db.query(
      `
      insert into analyses (requested_urlkey, scraped_urlkey, report)
      values ($1, $2, $3)
      on conflict (scraped_urlkey)
      do update
      set report = $4;
      `,
      [toUrlKey({ url: requestedUrl }), resolvedKey, report, report] // @TODO use real URL!!!!
      )
    await db.query('commit')
  } catch (err) {
    await db.query('rollback')
    throw err
  }
  return report
}

interface ReporterIO {
  ws: WebSocket
  result?: AnalysisResult
}
export function create (config: Config, { logger, pool }: Services) {
  const subject$ = new Subject<ReporterIO>()
  logger.debug(`# of free connections: ${pool.idleCount}`)
  const inner$: Observable<ReporterIO> = from(subject$).pipe(
    tap(() => logger.debug('attempting report generation')),
    mergeMap(async io => ({ io, db: await pool.connect() })),
    mergeMap(async ({ io, db }) => {
      const z = await getNextInQueue(db)
      return of(z).pipe(
        map(records => records.rows[0]),
        filter(Boolean as any),
        // eslint-disable-next-line
        mergeMap(async ({ id, source_url: requestedUrl }: { id: number, source_url: string }) =>
          from(analyze({ config, db, logger, requestedUrl })).pipe(
            delayWhen(() => from(db.query('delete from analyze_queue where id = $1', [id]))),
            mergeMap(async result => {
              return { ...io, result: result as AnalysisResult }
            })
          ).toPromise()
            .catch(err => {
              logger.error(`failed to analyze: ${err.message}`)
              setTimeout(() => {
                logger.warn('retrying report')
                subject$.next(io) // sloppy RETRY!
              }, 10000)
              return io
            })
        ),
        finalize(() => db.release()),
        ).toPromise()
      }),
      filter(io => !!io.result),
      tap(io => subject$.next(io)) // try and process _next_
  )
  inner$.subscribe(io => {
    logger.info(`report ${io.result!.url} analyzed`)
  })
  return subject$
}

export const getNextInQueue = (db: PoolClient) =>
  db.query('select * from analyze_queue order by id asc limit 1')
