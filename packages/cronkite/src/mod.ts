import { Config } from './config'
import {
  createCommon as createCommonMiddlewares,
  createApi as createApiMiddlewares
} from './middlewares'
import { createParcelMiddleware } from './middlewares/parcel'
import { Logger } from './util/logger'
import { resolve } from 'path'
import Koa from 'koa'
import mount from 'koa-mount'
import serve from 'koa-static'

export function start (config: Config, util: { logger: Logger }) {
  const app = new Koa()
  const api = new Koa()
  const fileserver = new Koa()
  const staticMiddleware = serve(config.paths.staticDirname, { defer: false })
  createCommonMiddlewares(config, util.logger).forEach(mw => app.use(mw))
  createApiMiddlewares(config, util.logger).forEach(mw => api.use(mw))

  const parcelMiddleware = createParcelMiddleware({
    entryHtmlFilename: config.paths.uiHtmlEntryFilename,
    parcelOptions: {
      outDir: config.paths.staticDirname,
      outFile: resolve(config.paths.staticDirname, 'index.html')
    },
    staticMiddleware
  })
  fileserver.use((ctx, next) =>
    staticMiddleware(ctx, async () =>
      !ctx.path.match(/\/api/) && ctx.status === 404
        ? parcelMiddleware(ctx, next)
        : next()
    )
  )
  app.use(mount('/api', api))
  app.use(mount('/', fileserver))
  app.listen(config.port)
  util.logger.info(`📡 listening on ${config.port}`)
}
