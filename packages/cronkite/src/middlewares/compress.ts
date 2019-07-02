import Koa from 'koa'
const compress = require('koa-compress')()
export const middleware: Koa.Middleware = (ctx, next) => {
  return compress(ctx, next)
}
