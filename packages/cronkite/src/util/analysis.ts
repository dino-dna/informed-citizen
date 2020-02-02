import { snakeCase } from 'lodash'
import URL from 'url'

// eslint-disable-next-line
export function toUrlKey (params: { url: string }): string
// eslint-disable-next-line
export function toUrlKey (params: { hostname: string; pathname: string }): string
// eslint-disable-next-line
export function toUrlKey ({ hostname, pathname, url }: any) {
  if (hostname && pathname) return snakeCase(`${hostname}_${pathname}`)
  const parsed = URL.parse(decodeURIComponent(url))
  if (!parsed.hostname || !parsed.pathname) throw new Error(`failed to convert to url key: ${url}`)
  return snakeCase(`${parsed.hostname}_${parsed.pathname}`)
}
