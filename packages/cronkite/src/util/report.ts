import { Api500, Api502 } from '../errors'
import { AnalysisResult } from '../common'

const DEFAULT_JSON_HEADER_VALUES = 'application/json; charset=utf-8'
const DEFAULT_HEADERS = {
  accept: DEFAULT_JSON_HEADER_VALUES,
  'content-type': DEFAULT_JSON_HEADER_VALUES
}

export interface ScrapeResult {
  url: string // fully resolved url, vs user provided url
  text: string
  title: string
}
export async function scrapeReport ({ scraperApiEndpoint, reportUrl }: { scraperApiEndpoint: string; reportUrl: string }): Promise<ScrapeResult> {
  const [scrapeResult, reportUrlRes] = await Promise.all([fetch(`${scraperApiEndpoint}/?url=${reportUrl}`, {
    headers: DEFAULT_HEADERS
  }), fetch(reportUrl)])
  if (scrapeResult.status >= 500) throw new Api502('failed to access scrape service')
  if (scrapeResult.status >= 300) throw new Api500('failed to access scrape service')
  const scrapeRes = await scrapeResult.json() as ScrapeResult
  return { ...scrapeRes, url: reportUrlRes.url }
}

export interface RequestAnalysis {
  analyzerApiEndpoint: string
  scrapeResult: ScrapeResult
}
export async function requestAnalysis ({ analyzerApiEndpoint, scrapeResult: { text, title, url } }: RequestAnalysis) {
  const analyzedResult = await fetch(analyzerApiEndpoint, {
    // @ts-ignore - non-standard node-fetch only timeout arg
    timeout: 120000,
    body: JSON.stringify({ content: text, title, url }),
    headers: DEFAULT_HEADERS,
    method: 'post'
  })
  if (analyzedResult.status >= 500) throw new Api502('failed to access analyzer')
  if (analyzedResult.status >= 300) throw new Api500('failed to access analyzer')
  const analysis = await analyzedResult.json()
  const res: AnalysisResult = {
    analysis,
    text,
    title,
    url
  }
  return res
}
