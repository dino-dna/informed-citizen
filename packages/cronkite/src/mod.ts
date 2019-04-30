import Koa from 'koa'
import { Config } from './config'
import { Logger } from './util/logger'
import { create as createMiddlewares } from './middlewares'

export function start (config: Config, util: { logger: Logger }) {
  const app = new Koa()
  const middlewares = createMiddlewares(config, util.logger)
  middlewares.forEach(mw => app.use(mw))
  app.listen(config.port)
  util.logger.info(`📡 listening on ${config.port}`)
}
