export interface Config {
  analyzerApiEndpoint: string
  db: {
    user: string
    database: string
    password: string
    port: number
    host: string
    application_name: string, // eslint-disable-line
    idleTimeoutMillis: number
  }
  facebookApiId: string
  logLevel: 'error' | 'warn' | 'info' | 'verbose' | 'debug'
  logPrettyPrint: boolean
  origin: string
  paths: {
    projectRootDirname: string
    staticDirname: string
    uiHtmlEntryFilename: string
  }
  port: number
  scraperApiEndpoint: string
}

export const get: (opts: {
  isDev: boolean,
  paths: {
    projectRootDirname: string
    staticDirname: string
    uiHtmlEntryFilename: string
  }
}) => Config = ({ isDev,   paths: {
  projectRootDirname,
  staticDirname,
  uiHtmlEntryFilename
} }) => ({
  analyzerApiEndpoint: process.env.ANALYZER_API_ENDPOINT || 'http://localhost:8080/fakebox/check',
  db: {
    user: process.env.CRONKITE_DB_USER!,
    database: process.env.POSTGRES_DB!,
    password: process.env.CRONKITE_DB_PASSWORD!,
    port: 5432,
    host: process.env.DB_HOST || '127.0.0.1',
    application_name: 'informed',
    idleTimeoutMillis: 5000
  },
  logLevel: (process.env.LOG_LEVEL as any) || (isDev ? 'verbose' : 'info'),
  logPrettyPrint: isDev,
  origin: process.env.ORIGIN!,
  facebookApiId: process.env.FACEBOOK_APP_ID || '',
  paths: {
    projectRootDirname,
    staticDirname,
    uiHtmlEntryFilename
  },
  port: process.env.PORT ? parseInt(process.env.PORT) : 7777,
  scraperApiEndpoint: process.env.SCRAPER_API_ENDPOINT || 'http://localhost:38765/'
})
