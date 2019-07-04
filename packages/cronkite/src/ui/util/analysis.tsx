import {
  DomainCategories,
  AnalysisResult,
  AnalysisDecision,
  AnalysisRatingCategory,
  ArticleAnalysis
} from '../../common'
import * as React from 'react'

export const DESIRED_DOMAIN_CATEGORIES: DomainCategories[] = ['credible', 'trusted']

export const analyze = async ({ url, fetch }: { url: string; fetch: GlobalFetch['fetch'] }) => {
  const res = await fetch(`/api/report?url=${url}`)
  if (res.status >= 300) {
    throw new Error(`failed to get analysis: ${res.statusText}`)
  }
  try {
    const json = await res.json()
    return json as AnalysisResult
  } catch (err) {
    console.log(err)
    throw err // @TODO hacks, handle gracefully
  }
}

export const calculateAnalysisNetScore = ({
  contentScore,
  titleScore
}: {
  contentScore: number
  titleScore: number
}) => contentScore * 0.75 + titleScore * 0.25
export const testIsBiased = ({
  titleDecision,
  contentDecision
}: {
  titleDecision: AnalysisDecision
  contentDecision: AnalysisDecision
}) => titleDecision === 'bias' || contentDecision === 'bias'
export const testIsGoodDomain = (category: string) =>
  DESIRED_DOMAIN_CATEGORIES.some(d => d === category)

export const mapNetScoreToCategory = (score: number) =>
  score >= 0.85
    ? AnalysisRatingCategory.GOOD
    : score >= 0.75
      ? AnalysisRatingCategory.OK
      : score >= 0.65
        ? AnalysisRatingCategory.NEUTRAL
        : AnalysisRatingCategory.BAD

export const getShortAnalysisClaim = ({
  isBiased,
  isContentUnsure,
  isGoodDomain,
  scoreCategory
}: ReturnType<typeof getMetrics>) => {
  if (scoreCategory === AnalysisRatingCategory.GOOD) return 'trustworthy'
  if (scoreCategory === AnalysisRatingCategory.OK) return 'likey trustworthy'
  if (scoreCategory === AnalysisRatingCategory.NEUTRAL) {
    if (isContentUnsure) {
      if (isGoodDomain) return 'good source, but uncertain'
      return 'uncertain'
    }
    if (isBiased) return 'known bias, recommend to avoid'
  }
  return 'untrustworthy'
}
export const getGeneralAnalysisClaim = ({
  asReact,
  contentDecision,
  isBiased,
  isContentUnsure
}: {
  asReact?: boolean
  contentDecision: string
  isBiased: boolean
  isContentUnsure: boolean
}) => {
  if (isBiased) {
    if (!asReact) return 'article is biased'
    return (
      <span className='article_analysis_card--first-glance --warning'>
        article is <span style={{ color: 'red', padding: 4 }}>biased</span>
      </span>
    )
  }
  const claim = isContentUnsure
    ? "we're unsure about this article. safe to avoid"
    : `article is ${contentDecision}`
  if (!asReact) return claim
  return <span className='article_analysis_card--first-glance'>{claim}</span>
}

export const getMetrics = ({
  content: { score: contentScore, decision: contentDecision },
  domain: { category: domainCategory },
  title: { score: titleScore, decision: titleDecision }
}: ArticleAnalysis) => {
  const netScore = calculateAnalysisNetScore({ contentScore, titleScore })
  return {
    isBiased: testIsBiased({ contentDecision, titleDecision }),
    isContentUnsure: contentDecision === 'unsure',
    isGoodDomain: testIsGoodDomain(domainCategory),
    netScore,
    scoreCategory: mapNetScoreToCategory(netScore)
  }
}
