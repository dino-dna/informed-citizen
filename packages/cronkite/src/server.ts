import { Config } from './config'
import {
  createCommon as createCommonMiddlewares,
  createApi as createApiMiddlewares
} from './middlewares'
import { createParcelMiddleware } from './middlewares/parcel'
import { resolve, extname } from 'path'
import compose from 'koa-compose'
import Koa from 'koa'
import serve from 'koa-static'
import { Services } from './services'

export async function start (config: Config, services: Services) {
  const { logger } = services
  const app = new Koa()
  const staticMiddleware = serve(config.paths.staticDirname, { defer: false })
  app.use(compose(await createCommonMiddlewares(config, services)))
  const apiMiddleware: Koa.Middleware = compose(createApiMiddlewares(config, services))
  const parcelMiddleware = createParcelMiddleware({
    config,
    entryHtmlFilename: config.paths.uiHtmlEntryFilename,
    parcelOptions: {
      outDir: config.paths.staticDirname,
      outFile: resolve(config.paths.staticDirname, 'index.html')
    },
    services,
    staticMiddleware
  })
  app.use((ctx, next) => {
    const isApiCall = !!ctx.path.match(/\/api/)
    if (isApiCall) return apiMiddleware(ctx, next)
    const extension = extname(ctx.path)
    const isHtml = extension === '.html'
    if (!isApiCall && (isHtml || !extension)) return parcelMiddleware(ctx, next)
    return staticMiddleware(ctx, async () =>
      !isApiCall && ctx.status === 404 ? parcelMiddleware(ctx, next) : next()
    )
  })
  app.listen(config.port)
  logger.info(`📡 listening on ${config.port}`)
}
