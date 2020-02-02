import Router from 'koa-router'
import { Config } from '../config'
import { Logger } from '../util/logger'
import Koa from 'koa'
import { get } from '../routes/report'
import { Services } from '../services';

export function middleware (config: Config, services: Services): Koa.Middleware {
  const router = new Router()
  router.get('/api/report', (ctx, next) => get(config, services)(ctx, next))
  return router.routes() as any
}
