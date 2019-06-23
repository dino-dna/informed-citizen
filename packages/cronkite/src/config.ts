export interface Config {
  analyzerApiEndpoint: string
  logLevel: 'error' | 'warn' | 'info' | 'verbose' | 'debug'
  port: number
  scraperApiEndpoint: string
  paths: {
    projectRootDirname: string
    staticDirname: string
    uiHtmlEntryFilename: string
  }
}
