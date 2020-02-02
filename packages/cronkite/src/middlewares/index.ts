import createDebug from 'debug'
import Koa, { Middleware } from 'koa'
import compose from 'koa-compose'
import { Config } from '../config'
import { Services } from '../services'
import { middleware as bodyParser } from './body-parser'
import { middleware as compress } from './compress'
import { createMiddleware as createErrorHandlerMiddleware } from './error-handler'
import { createMiddleware as createHelmetMiddleware } from './helmet'
import { createMiddleware as createLazyDbMiddleware } from './lazy-db'
import { middleware as createLoggerMiddleware } from './logger'
import { middleware as responseTime } from './response-time'
import { middleware as routerMiddleware } from './router'
import websocket = require('koa-easy-ws')

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
    { fn: websocket, name: 'koa-easy-ws' },
    { fn: compress, name: 'compress' },
  ].map(toDebugMiddleware)
  return middlewares
}

export const withCommon = (config: Config, services: Services) =>
  createCommon(config, services).then(mws => compose(mws))

export function createApi (config: Config, services: Services) {
  return [
    {  fn: routerMiddleware(config, services), name: 'router' }
  ].map(toDebugMiddleware)
}

export const withApi = (config: Config, services: Services) =>
  compose(createApi(config, services))
