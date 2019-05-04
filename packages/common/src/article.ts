export interface ArticleScrapeRaw {
  'images:': string[]
  authors: string[]
  html: string
  movies: string[]
  publish_date: string
  text: string
  title: string
  topimage: string
}

export interface ArticleScrape {
  'images:': string[]
  authors: string[]
  html: string
  movies: string[]
  publish_date: Date
  text: string
  title: string
  topimage: string
}

export function fromRaw (raw: ArticleScrapeRaw): ArticleScrape {
  return {
    ...raw,
    publish_date: new Date(parseInt(raw.publish_date) * 1000)
  }
}

export interface ArticleAnalysis {
}
