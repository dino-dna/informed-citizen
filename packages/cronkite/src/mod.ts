import Koa from 'koa'
import mount from 'koa-mount'
import { Config } from './config'
import { Logger } from './util/logger'
import path from 'path'
import fs from 'fs'
import {
  createCommon as createCommonMiddlewares,
  createApi as createApiMiddlewares
} from './middlewares'
import { isDev } from 'common'
import serve = require('koa-static')

const PUBLIC_DIRNAME = path.resolve(__dirname, '../../ui/build')

export function start (config: Config, util: { logger: Logger }) {
  const app = new Koa()
  const api = new Koa()
  const fileserver = new Koa()
  const staticHandler = serve(PUBLIC_DIRNAME, { defer: false })
  createCommonMiddlewares(config, util.logger).forEach(mw => app.use(mw))
  createApiMiddlewares(config, util.logger).forEach(mw => api.use(mw))
  fileserver.use((ctx, next) =>
    staticHandler(ctx, async () => {
      if (!ctx.path.match(/\/api/) && ctx.status === 404) {
        ctx.body = fs.createReadStream(`${PUBLIC_DIRNAME}/index.html`)
        ctx.type = 'html'
      }
      return next()
    })
  )
  app.use(mount('/api', api))
  !isDev && app.use(mount('/', fileserver))
  app.listen(config.port)
  util.logger.info(`📡 listening on ${config.port}`)
}
