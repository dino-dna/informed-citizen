import { Config } from '../config'
import { createMiddleware as createHelmetMiddleware } from './helmet'
import { Logger } from '../util/logger'
import { middleware as bodyParser } from './body-parser'
import { middleware as compress } from './compress'
import { middleware as createLoggerMiddleware } from './logger'
import { createMiddleware as createErrorHandlerMiddleware } from './error-handler'
import { middleware as responseTime } from './response-time'
import { middleware as routerMiddleware } from './router'
import createDebug from 'debug'
import Koa from 'koa'

export function create (config: Config, logger: Logger) {
  const debug = createDebug('informed:common:middleware')
  const middlewares = [
    { fn: responseTime, name: 'responseTime' },
    { fn: createLoggerMiddleware(logger), name: 'logger' },
    { fn: createErrorHandlerMiddleware(logger), name: 'errorHandler' },
    { fn: createHelmetMiddleware(), name: 'helmet' },
    { fn: bodyParser, name: 'bodyParser' },
    { fn: compress, name: 'compress' },
    { fn: routerMiddleware(config, logger), name: 'router' }
  ].map((meta, i) => {
    const middlewareDebugLogger: Koa.Middleware = async (ctx, next) => {
      debug(`entering middleware ${i} [${meta.name}] `)
      await meta.fn(ctx, next)
      debug(`exiting middleware ${i} [${meta.name}]`)
    }
    ;(middlewareDebugLogger as any).middlewareName = meta.name
    return middlewareDebugLogger
  })
  return middlewares
}
