import { Config } from './config'
import { create } from './util/logger'
import { start } from './mod'
require('perish')

const config: Config = {
  analyzerApiEndpoint:
    process.env.ANALYZER_API_ENDPOINT || 'http://localhost:8080/fakebox/check',
  logLevel: (process.env.LOG_LEVEL as any) || 'info',
  port: process.env.PORT ? parseInt(process.env.PORT) : 7777,
  scraperApiEndpoint:
    process.env.SCRAPER_API_ENDPOINT || 'http://localhost:38765/'
}

start(config, { logger: create({ level: config.logLevel }) })
