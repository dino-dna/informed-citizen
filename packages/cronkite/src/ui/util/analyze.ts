import { AnalysisResult } from 'common'

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
  }
}
