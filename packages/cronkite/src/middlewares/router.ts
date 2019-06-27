import Router from 'koa-router'
import url from 'url'
import { Config } from '../config'
import { Logger } from '../util/logger'
import Koa from 'koa'
import { Api400, Api500 } from '../errors'

import fetch from 'node-fetch'
const DEFAULT_JSON_HEADER_VALUES = 'application/json; charset=utf-8'

export type AnalysisReport = {
  analysis: string
  text: string
  title: string
}

export function middleware (config: Config, logger: Logger): Koa.Middleware {
  const router = new Router()
  router.get('/api/report', async ctx => {
    const {
      query: { url: reportUrl = '' },
      params: { id }
    } = ctx
    const parsed = url.parse(reportUrl)
    const { protocol = '', hostname = '', pathname = '' } = parsed
    if (!protocol || !hostname) {
      throw new Api400('missing or invalid url query provided')
    }
    const db = await ctx.getDb
    const urlkey = `${hostname}_${pathname}`
    const existingQueryResult = await db.query(
      `select * from analyses where urlkey = $1 limit 1`,
      [urlkey]
    )
    if (existingQueryResult.rows.length) {
      const res = existingQueryResult.rows[0]
      return (ctx.body = res.report as AnalysisReport)
    }
    const report = await fetchReport({ config, reportUrl })
    await db.query(
      `
      insert into analyses (urlkey, report)
      values ($1, $2)
      on conflict (urlkey)
      do update
      set report = $3;
    `,
      [urlkey, report, report]
    )
    ctx.body = report
  })
  return router.routes() as any
}

async function fetchReport ({
  config,
  reportUrl
}: {
  config: Config
  reportUrl: string
}) {
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
    throw new Api500('failed to access analyzer')
  }
  const analysis = await analyzedResult.json()
  const res: AnalysisReport = {
    analysis,
    text,
    title
  }
  return res
}
