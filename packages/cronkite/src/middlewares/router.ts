import Router from 'koa-router'
import url from 'url'
import { Config } from '../config'
import { Logger } from '../util/logger'
import Koa from 'koa'
import { Api400, Api500 } from '../errors'

import fetch from 'node-fetch'
const DEFAULT_JSON_HEADER_VALUES = 'application/json; charset=utf-8'

export function middleware (config: Config, logger: Logger): Koa.Middleware {
  const router = new Router()
  router.get('/api/report', async ctx => {
    const {
      query: { url: reportUrl = '' }
    } = ctx
    const parsed = url.parse(reportUrl)
    const { protocol, host, hostname } = parsed
    if (!protocol || !(host || hostname)) {
      throw new Api400('missing or invalid url query provided')
    }
    const scrapeResult = await fetch(
      `${config.scraperApiEndpoint}/?url=${reportUrl}`,
      {
        headers: {
          accept: DEFAULT_JSON_HEADER_VALUES
        }
      }
    )
    if (scrapeResult.status >= 300) {
      throw new Api500('failed to access scrape service')
    }
    const {
      text,
      title
    }: { text: string; title: string } = await scrapeResult.json()
    const analyzedResult = await fetch(config.analyzerApiEndpoint, {
      timeout: 120000,
      body: JSON.stringify({ content: text, title, url: reportUrl }),
      headers: {
        accept: DEFAULT_JSON_HEADER_VALUES,
        'content-type': DEFAULT_JSON_HEADER_VALUES
      },
      method: 'post'
    })
    if (analyzedResult.status >= 300) {
      throw new Api500('failed to access analyze service')
    }
    const analysis = await analyzedResult.json()
    ctx.body = { analysis, text, title }
  })
  return router.routes() as any
}
