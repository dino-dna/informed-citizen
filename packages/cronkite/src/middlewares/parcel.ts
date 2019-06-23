import Bundler from 'parcel-bundler'
import { isDev } from 'common'
import { createMiddleware, CreateMiddlewareConfig } from 'koa-parcel-middleware' // :)
import { resolve } from 'path'
import { WebAppUnavailableError } from '../errors'
import { readFile } from 'fs-extra'
import CombinedStream from 'combined-stream'

export interface CreateParcelMiddlewareOptions {
  entryHtmlFilename: string
  parcelOptions: Partial<Bundler.ParcelOptions>
  staticMiddleware: CreateMiddlewareConfig['staticMiddleware']
}

const securityDirname = resolve(__dirname, '../../../../reverse-proxy/security')

export function createParcelMiddleware ({
  entryHtmlFilename,
  parcelOptions,
  staticMiddleware
}: CreateParcelMiddlewareOptions) {
  const options: Bundler.ParcelOptions = {
    detailedReport: isDev,
    watch: isDev,
    minify: !isDev,
    scopeHoist: false,
    sourceMaps: isDev,
    hmr: isDev,
    hmrPort: isDev ? 7778 : -1,
    https: isDev
      ? ({
        cert: resolve(securityDirname, 'cert.pem'),
        key: resolve(securityDirname, 'key.pem')
      } as Bundler.HttpsOptions)
      : false,
    ...parcelOptions
  }
  const bundler = new Bundler(entryHtmlFilename, options)
  let builtEntrypointFilename = ''
  bundler.bundle()
  bundler.on('bundled', bundle => {
    builtEntrypointFilename = bundle.name
  })
  return createMiddleware({
    bundler,
    staticMiddleware,
    renderHtmlMiddleware: async (ctx, next) => {
      if (!builtEntrypointFilename) throw new WebAppUnavailableError()
      const outFileBuffer = await readFile(builtEntrypointFilename)
      const [preBody, postBody] = outFileBuffer.toString().split(/<body>/)
      const [_, reportId] = ctx.path.match(/report\/([^/]+)/) || [null, null]
      let injectedBody = ''
      // testin...
      const db = await ctx.getDb
      const values = await db.query(`select * from analyses`)
      if (reportId) {
        injectedBody = [
          '<span>',
          'report:',
          reportId,
          JSON.stringify(values.fields),
          '</span>'
        ].join('')
      }
      ctx.body = [preBody, '<body>', injectedBody, postBody].reduce(
        (stream, chunk) => {
          stream.append(chunk)
          return stream
        },
        new CombinedStream()
      )
      ctx.type = 'html'
      await next()
    }
  })
}
