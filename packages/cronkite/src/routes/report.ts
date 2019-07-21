import { Middleware } from 'koa'
import { toUrlkey } from '../util/analysis'
import { Api400 } from '../errors'
import url from 'url'

import { AnalysisResult } from '../common'
import { fetchReport } from '../util/report'
import { Config } from '../config'

export const get: (config: Config) => Middleware = config => async ctx => {
  const {
    query: { url: reportUrl = '' }
  } = ctx
  const parsed = url.parse(decodeURIComponent(reportUrl))
  const { protocol = '', hostname = '', pathname = '' } = parsed
  if (!protocol || !hostname) {
    throw new Api400('missing or invalid url query provided')
  }
  const urlkey = toUrlkey({ hostname, pathname })
  const db = await ctx.getDb
  const existingQueryResult = await db.query(`select * from analyses where urlkey = $1 limit 1`, [
    urlkey
  ])
  if (existingQueryResult.rows.length) {
    const res = existingQueryResult.rows[0]
    return (ctx.body = res.report as AnalysisResult)
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
}
