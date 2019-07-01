import Bundler from 'parcel-bundler'
import { isDev, AnalysisResult } from 'common'
import { createMiddleware, CreateMiddlewareConfig } from 'koa-parcel-middleware' // :)
import { resolve } from 'path'
import { WebAppUnavailableError, WebApp404 } from '../errors'
import { readFile } from 'fs-extra'
import CombinedStream from 'combined-stream'
import Koa from 'koa'
import { Services } from '../services'
import url from 'url'
import { toUrlkey } from '../util/analysis'

export interface CreateParcelMiddlewareOptions {
  entryHtmlFilename: string
  parcelOptions: Partial<Bundler.ParcelOptions>
  staticMiddleware: CreateMiddlewareConfig['staticMiddleware']
  services: Services
}

const securityDirname = resolve(__dirname, '../../../../reverse-proxy/security')

const toFacebookXml = ({ ctx, title }: { ctx: Koa.Context; title: string }) => `
<meta property="og:url" content="${ctx.href}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="AutoAnalysis - This article is FAKE, and should not be trusted - Informed Citizen" />
<meta property="og:description" content="AutoAnalysis reports that the associated article is FAKE.  \nTitle: ${title}" />
<meta property="og:image" content="/fist.png" />
`
export function createParcelMiddleware ({
  entryHtmlFilename,
  parcelOptions,
  staticMiddleware,
  services
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
      const reportUrl = (ctx.query.url || '').trim()
      const parsed = url.parse(reportUrl)
      const { hostname = '', pathname = '' } = parsed
      const urlkey = toUrlkey({ hostname, pathname })
      const outFileBuffer = await readFile(builtEntrypointFilename)
      const [preHead, postHead] = outFileBuffer.toString().split(/<head>/)
      let injectedHead = ''
      if (reportUrl) {
        const [analysis] = await services.knex
          .columns('id', 'report')
          .from<{ id: number; report: AnalysisResult }>('analyses')
          .where('urlkey', urlkey)
        if (!analysis) throw new WebApp404('no report source article url found')
        injectedHead = toFacebookXml({ ctx, title: analysis.report.title })
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
