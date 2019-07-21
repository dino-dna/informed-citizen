import { Api500 } from '../errors'
import { Config } from '../config'
import { AnalysisResult } from '../common'

const DEFAULT_JSON_HEADER_VALUES = 'application/json; charset=utf-8'

export async function fetchReport ({ config, reportUrl }: { config: Config; reportUrl: string }) {
  const scrapeResult = await fetch(`${config.scraperApiEndpoint}/?url=${reportUrl}`, {
    headers: {
      accept: DEFAULT_JSON_HEADER_VALUES
    }
  })
  if (scrapeResult.status >= 300) throw new Api500('failed to access scrape service')
  const { text, title }: { text: string; title: string } = await scrapeResult.json()
  const analyzedResult = await fetch(config.analyzerApiEndpoint, {
    // @ts-ignore - non-standard node-fetch only timeout arg
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
  const res: AnalysisResult = {
    analysis,
    text,
    title
  }
  return res
}
