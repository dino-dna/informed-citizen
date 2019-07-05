import { Config } from '../config'
import { createMiddleware as createHelmetMiddleware } from './helmet'
import { middleware as bodyParser } from './body-parser'
import { middleware as compress } from './compress'
import { middleware as createLoggerMiddleware } from './logger'
import { createMiddleware as createErrorHandlerMiddleware } from './error-handler'
import { createMiddleware as createLazyDbMiddleware } from './lazy-db'
import { middleware as responseTime } from './response-time'
import { middleware as routerMiddleware } from './router'
import createDebug from 'debug'
import Koa, { Middleware } from 'koa'
import { Services } from '../services'

const debug = createDebug('informed:middleware')

function toDebugMiddleware (meta: { fn: Middleware; name: string }, i: number) {
  const middlewareDebugLogger: Koa.Middleware = async (ctx, next) => {
    debug(`entering middleware ${i} [${meta.name}] `)
    await meta.fn(ctx, next)
    debug(`exiting middleware ${i} [${meta.name}]`)
  }
  ;(middlewareDebugLogger as any).middlewareName = meta.name
  return middlewareDebugLogger
}

export async function createCommon (config: Config, services: Services) {
  const { logger } = services
  const middlewares = [
    { fn: responseTime, name: 'responseTime' },
    { fn: createLoggerMiddleware(logger), name: 'logger' },
    { fn: createErrorHandlerMiddleware(logger), name: 'errorHandler' },
    { fn: createHelmetMiddleware(), name: 'helmet' },
    { fn: bodyParser, name: 'bodyParser' },
    { fn: await createLazyDbMiddleware(config, services), name: 'lazyDb' },
    { fn: compress, name: 'compress' }
  ].map(toDebugMiddleware)
  return middlewares
}

export function createApi (config: Config, services: Services) {
  return [{ fn: routerMiddleware(config, services.logger), name: 'router' }].map(toDebugMiddleware)
}
