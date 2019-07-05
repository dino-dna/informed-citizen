import { Api503 } from '../errors'
import { Config } from '../config'
import { from, TimeoutError } from 'rxjs'
import { Pool } from 'pg'
import { Services } from '../services'
import { timeout } from 'rxjs/operators'
import * as Koa from 'koa'

export async function createMiddleware (config: Config, { logger }: Services) {
  const pool = new Pool(config.db)
  return async function middleware (ctx: Koa.BaseContext, next: any) {
    Object.defineProperty(ctx, 'getDb', {
      get () {
        return from(pool.connect())
          .pipe(timeout(3000))
          .toPromise()
          .then(db => {
            ;(ctx as any).__db = db
            logger.info(`${pool.idleCount} free connections of ${pool.totalCount}`)
            return db
          })
          .catch(err => {
            if (err instanceof TimeoutError) throw new Api503()
            throw err
          })
      }
    })
    try {
      await next()
    } finally {
      ;(ctx as any).__db && (ctx as any).__db.release()
    }
  }
}
