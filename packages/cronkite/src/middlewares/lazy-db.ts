import { Logger } from '../util/logger'
import * as Koa from 'koa'
import { Pool } from 'pg'
import { from, TimeoutError } from 'rxjs'
import { timeout } from 'rxjs/operators'
import { Api503 } from '../errors'

export async function createMiddleware (logger: Logger) {
  const pool = new Pool({
    user: process.env.CRONKITE_DB_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.CRONKITE_DB_PASSWORD,
    port: 5432,
    host: process.env.DB_HOST || '127.0.0.1',
    application_name: 'informed'
  })
  return async function middleware (ctx: Koa.BaseContext, next: any) {
    let isConnecting = false
    Object.defineProperty(ctx, 'getDb', {
      get () {
        isConnecting = true
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
