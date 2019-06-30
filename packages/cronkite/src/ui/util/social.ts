import Koa from 'koa'
export const isFacebookUserAgent = (ctx: Koa.Context) =>
  (ctx.headers['user-agent'] || '').includes('facebook')
