import Koa = require('koa')
import { extname } from 'path'

type CreateIngress = (opts: {
  apiMiddleware: Koa.Middleware
  parcelMiddleware: Koa.Middleware
  staticMiddleware: Koa.Middleware
}) => Koa.Middleware

/**
 * route user requests down appropriate middleware flows based on request
 * attributes
 */
export const ingress: CreateIngress = ({
  apiMiddleware,
  parcelMiddleware,
  staticMiddleware
}) => (ctx, next) => {
  const isApiCall = !!ctx.path.match(/\/api/)
  if (isApiCall) return apiMiddleware(ctx, next)
  const extension = extname(ctx.path)
  const isHtml = extension === '.html'
  if (isHtml || !extension) return parcelMiddleware(ctx, next)
  return staticMiddleware(ctx, () =>
    ctx.status === 404 ? parcelMiddleware(ctx, next) : next()
  )
}
