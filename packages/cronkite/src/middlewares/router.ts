import Router from 'koa-router'
import { Config } from '../config'
import { Logger } from '../util/logger'
import Koa from 'koa'
import { get } from '../routes/report'

export function middleware (config: Config, logger: Logger): Koa.Middleware {
  const router = new Router()
  router.get('/api/report', () => get(config))
  return router.routes() as any
}
