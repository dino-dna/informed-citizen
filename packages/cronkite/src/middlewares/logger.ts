import { Middleware } from 'koa'
import { isDev } from '../common'
import { Logger } from '../util/logger'

export const middleware: (logger: Logger) => Middleware = function (logger) {
  return async (ctx, next) => {
    await next()
    const {
      req: { method, url },
      res: { statusCode }
    } = ctx
    const payload = isDev
      ? `${method} ${statusCode} ${url}`
      : { req: { method, url }, res: { statusCode } }
    logger.info(payload as any)
  }
}
