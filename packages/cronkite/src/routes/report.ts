import { AnalysisResult } from '../common'
import { Api400 } from '../errors'
import { Config } from '../config'
import { Middleware } from 'koa'
import { toUrlKey } from '../util/analysis'
import { Services } from '../services';

export const get: (config: Config, services: Services) => Middleware = (config, services) => async ctx => {
  const {
    query: { url }
  } = ctx
  const key = await Promise.resolve(toUrlKey({ url })).catch(err => {
    throw new Api400(err.message)
  })
  const db = await ctx.getDb
  const existingResult = await db.query(
    `select * from analyses where requested_urlkey = $1 limit 1`,
    [key]
  )
  if (existingResult.rows.length) {
    const res = existingResult.rows[0]
    return (ctx.body = res.report as AnalysisResult)
  }
  await db.query('insert into analyze_queue (source_url) values ($1)', [url])
  services.reporter.next(1) // prod the reporter to do work
  ctx.body = { ok: true }
}
