import * as Koa from 'koa'
import { ApiError, WebAppError, CronkiteError } from '../errors'
import { Logger } from '../util/logger'

export function createMiddleware (logger: Logger) {
  return async function middleware (ctx: Koa.BaseContext, next: any) {
    try {
      await next()
    } catch (err) {
      const isCronkiteError = err instanceof CronkiteError
      const isWebAppError = isCronkiteError && err instanceof WebAppError
      const isApiError = isCronkiteError && err instanceof ApiError
      if (isCronkiteError) {
        let error = err as ApiError
        ctx.status =
          (error as any).status || (error.constructor as typeof ApiError).status
        const errorMessage =
          error.message || (error.constructor as typeof ApiError).defaultMessage
        ctx.body = isApiError
          ? {
              error: errorMessage
            }
          : errorMessage
        ctx.type = isApiError ? 'json' : 'text'
      } else {
        ctx.body = { error: 'Fatal error' }
        ctx.status = err.status || 500
        logger.error(err)
      }
    }
  }
}
