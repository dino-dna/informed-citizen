import Bundler from 'parcel-bundler'
import { isDev } from 'common'
import { createMiddleware, CreateMiddlewareConfig } from 'koa-parcel-middleware' // :)
import { resolve } from 'path'
import { WebAppUnavailableError } from '../errors'
import { readFile } from 'fs-extra'
import CombinedStream from 'combined-stream'
import Koa from 'koa'

export interface CreateParcelMiddlewareOptions {
  entryHtmlFilename: string
  parcelOptions: Partial<Bundler.ParcelOptions>
  staticMiddleware: CreateMiddlewareConfig['staticMiddleware']
}

const securityDirname = resolve(__dirname, '../../../../reverse-proxy/security')

const toFacebookXml = ({ ctx, title }: { ctx: Koa.Context; title: string }) => `
<meta property="og:url" content="${ctx.href}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="AutoAnalysis for '${title}' - Informed Citizen" />
<meta property="og:description" content="weeee" />
`
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
      const [preHead, postHead] = outFileBuffer.toString().split(/<head>/)
      const [_, reportId] = ctx.path.match(/report\/([^/]+)/) || [null, null]
      let injectedHead = ''
      // testin...
      const db = await ctx.getDb
      const values = await db.query(`select * from analyses`)
      if (reportId) {
        injectedHead = [
          '<span>',
          'report:',
          reportId,
          JSON.stringify(values.fields),
          '</span>'
        ].join('')
      } else {
        injectedHead = [
          '<meta property="og:image" content="/fist.png" />'
        ].join('')
      }
      ctx.body = [preHead, '<head>', injectedHead, postHead].reduce(
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
