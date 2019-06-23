import Bundler, { HttpsOptions } from 'parcel-bundler'
import { isDev } from 'common'
import { createMiddleware, CreateMiddlewareConfig } from 'koa-parcel-middleware' // :)
import { resolve } from 'path'

export interface CreateParcelMiddlewareOptions {
  entryHtmlFilename: string
  parcelOptions: Partial<Bundler.ParcelOptions>
  staticMiddleware: CreateMiddlewareConfig['staticMiddleware']
}

export function createParcelMiddleware ({
  entryHtmlFilename,
  parcelOptions,
  staticMiddleware
}: CreateParcelMiddlewareOptions) {
  const options: Bundler.ParcelOptions = {
    watch: isDev,
    minify: !isDev,
    scopeHoist: false,
    sourceMaps: isDev,
    hmr: isDev,
    hmrPort: isDev ? 7778 : -1,
    https: isDev
      ? ({
        cert: resolve(
          __dirname,
          '../../../../reverse-proxy/security/cert.pem'
        ),
        key: resolve(__dirname, '../../../../reverse-proxy/security/key.pem')
      } as Bundler.HttpsOptions)
      : false,
    detailedReport: isDev,
    ...parcelOptions
  }
  const bundler = new Bundler(entryHtmlFilename, options)
  bundler.bundle()
  return createMiddleware({
    bundler,
    staticMiddleware
  })
}
