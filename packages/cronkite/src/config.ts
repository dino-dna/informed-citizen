export interface Config {
  analyzerApiEndpoint: string
  scraperApiEndpoint: string
  port: number
  logLevel: 'error' | 'warn' | 'info' | 'verbose' | 'debug'
}
