import { createMiddleware, CreateMiddlewareConfig } from 'koa-parcel-middleware' // :)
import { getMetrics, getGeneralAnalysisClaim, getShortAnalysisClaim } from '../ui/util/analysis'
import { isDev, AnalysisResult, AnalysisRatingCategory } from '../common'
import { readFile } from 'fs-extra'
import { resolve } from 'path'
import { Services } from '../services'
import { toUrlkey } from '../util/analysis'
import { WebAppUnavailableError, WebApp404 } from '../errors'
import Bundler from 'parcel-bundler'
import CombinedStream from 'combined-stream'
import Koa from 'koa'
import url from 'url'

const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export interface CreateParcelMiddlewareOptions {
  entryHtmlFilename: string
  parcelOptions: Partial<Bundler.ParcelOptions>
  staticMiddleware: CreateMiddlewareConfig['staticMiddleware']
  services: Services
}

const securityDirname = resolve(__dirname, '../../../../reverse-proxy/security')

const toFacebookXml = ({
  claim,
  ctx,
  shortClaim,
  scoreCategory,
  title
}: {
  claim: string
  ctx: Koa.Context
  shortClaim: string
  scoreCategory?: AnalysisRatingCategory
  title: string
}) => `
<meta property="og:url" content="${ctx.href}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${capitalize(shortClaim)} - Informed Citizen - AutoAnalysis" />
<meta property="og:description" content="${capitalize(claim)}. analysis for article '${title}'" />
<meta property="fb:app_id" content="${process.env.FACEBOOK_APP_ID}" />
${
  scoreCategory
    ? `<meta property="og:image" content="${
      process.env.ORIGIN
    }/thumb_${scoreCategory.toLowerCase()}.png" />`
    : `<meta property="og:image" content="${process.env.ORIGIN}/fist.png" />`
}
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
        const metrics = getMetrics(analysis.report.analysis)
        injectedHead = toFacebookXml({
          claim: getGeneralAnalysisClaim({
            ...metrics,
            contentDecision: analysis.report.analysis.content.decision
          }) as string,
          ctx,
          scoreCategory: metrics.scoreCategory,
          shortClaim: getShortAnalysisClaim({ ...metrics }),
          title: analysis.report.title
        })
      } else {
        injectedHead = ['<meta property="og:image" content="/fist.png" />'].join('')
      }
      ctx.body = [preHead, '<head>', injectedHead, postHead].reduce((stream, chunk) => {
        stream.append(chunk)
        return stream
      }, new CombinedStream())
      ctx.type = 'html'
      await next()
    }
  })
}
