export interface Config {
  analyzerApiEndpoint: string
  db: {
    user: string
    database: string
    password: string
    port: number
    host: string
    application_name: string // eslint-disable-line
  }
  facebookApiId: string
  logLevel: 'error' | 'warn' | 'info' | 'verbose' | 'debug'
  origin: string
  paths: {
    projectRootDirname: string
    staticDirname: string
    uiHtmlEntryFilename: string
  }
  port: number
  scraperApiEndpoint: string
}
