import { ConnectedApp } from './ui/src/App' // e.g. a react <App /> component
import {
  createCommon as createCommonMiddlewares,
  createApi as createApiMiddlewares
} from './middlewares'
import { Config } from './config'
import { createMiddleware } from 'koa-parcel-middleware' // :)
import { isDev } from 'common'
import { Logger } from './util/logger'
import * as ReactDOMServer from 'react-dom/server'
import Bundler from 'parcel-bundler'
import CombinedStream from 'combined-stream'
import fs from 'fs-extra'
import Koa from 'koa'
import mount from 'koa-mount'
import path from 'path'
import serve from 'koa-static'

const ENTRY_FILENAME = path.resolve(__dirname, '../../ui/public/index.html')
const outFile = path.resolve(__dirname, 'public', 'index.html')
const outDir = path.resolve(__dirname, 'public')

export function start (config: Config, util: { logger: Logger }) {
  const app = new Koa()
  const api = new Koa()
  const fileserver = new Koa()
  const staticHandler = serve(outDir, { defer: false })
  createCommonMiddlewares(config, util.logger).forEach(mw => app.use(mw))
  createApiMiddlewares(config, util.logger).forEach(mw => api.use(mw))

  const options: Bundler.ParcelOptions = {
    outDir,
    outFile,
    watch: isDev,
    minify: !isDev,
    scopeHoist: false,
    hmr: isDev,
    detailedReport: isDev
  }
  const bundler = new Bundler(ENTRY_FILENAME, options)
  bundler.bundle()
  const staticMiddleware = serve(outDir)
  fileserver.use((ctx, next) =>
    staticHandler(ctx, async () => {
      if (!ctx.path.match(/\/api/) && ctx.status === 404) {
        const parcelMiddleware = createMiddleware({
          bundler,
          renderHtmlMiddleware: async (ctx, next) => {
            // optionally wire in SSR!

            // index.html
            //
            // <html>
            //   <div id="app"><!-- ssr-content --></div>
            //   <script src="app.tsx"></script>
            // </html>
            const outFileBuffer = await fs.readFile(outFile)
            const [preAppEntry, postAppEntry] = outFileBuffer
              .toString()
              .split(/<!--.*ssr.*-->/)
            ctx.status = 200
            const htmlStream = new CombinedStream()
            ;[
              preAppEntry,
              ReactDOMServer.renderToNodeStream((ConnectedApp as any)()),
              postAppEntry
            ].map(content => htmlStream.append(content))
            ctx.body = htmlStream
            ctx.type = 'html'
            await next()
          },
          staticMiddleware
        })
        app.use((ctx, next) => parcelMiddleware(ctx, next))
      }
      return next()
    })
  )
  app.use(mount('/api', api))
  !isDev && app.use(mount('/', fileserver))
  app.listen(config.port)
  util.logger.info(`📡 listening on ${config.port}`)
}
