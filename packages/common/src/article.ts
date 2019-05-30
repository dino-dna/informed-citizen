export interface ArticleScrapeRaw {
  'images:': string[]
  authors: string[]
  html: string
  movies: string[]
  publish_date: string // eslint-disable-line
  text: string
  title: string
  topimage: string
}

export interface ArticleScrape {
  'images:': string[]
  authors: string[]
  html: string
  movies: string[]
  publish_date: Date // eslint-disable-line
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

export interface Entity {
  end: number
  start: number
  text: string
  type: string
}

export type DomainCategories =
  | 'unsure'
  | 'bias'
  | 'clickbait'
  | 'conspiracy'
  | 'credible'
  | 'fake'
  | 'hate'
  | 'junksci'
  | 'parody'
  | 'political'
  | 'rumor'
  | 'satire'
  | 'state'
  | 'trusted'
  | 'unknown'
  | 'unreliable'

export interface ArticleAnalysis {
  content: {
    decision: 'bias' | 'impartial' | 'unsure'
    entities: Entity[]
    keywords: { keyword: string }[]
    score: number
  }
  title: {
    decision: 'bias' | 'impartial' | 'unsure'
    entities: Entity[]
    score: number
  }
  success: boolean
  domain: {
    category: DomainCategories
    domain: string
  }
}
