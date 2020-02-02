import Koa from 'koa'
import serve from 'koa-static'
import { Config } from './config'
import { withApi, withCommon } from './middlewares'
import { ingress } from './middlewares/ingress'
import { createParcelMiddleware } from './middlewares/parcel'
import { Services } from './services'

export async function start (config: Config, services: Services) {
  const app = new Koa()
  const staticMiddleware = serve(config.paths.staticDirname, { defer: false })
  app.use(await withCommon(config, services))
  app.use(ingress({
    apiMiddleware: withApi(config, services),
    parcelMiddleware: createParcelMiddleware({ config, services, staticMiddleware  }),
    staticMiddleware
  }))
  app.listen(config.port)
  services.logger.info(`📡 listening on ${config.port}`)
}
