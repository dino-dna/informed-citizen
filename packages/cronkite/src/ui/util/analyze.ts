import { DomainCategories, AnalysisResult, AnalysisDecision } from 'common'

export const DESIRED_DOMAIN_CATEGORIES: DomainCategories[] = [
  'credible',
  'trusted'
]

export const analyze = async ({
  url,
  fetch
}: {
  url: string
  fetch: GlobalFetch['fetch']
}) => {
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

export const calculateAnalysisScore = ({
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
