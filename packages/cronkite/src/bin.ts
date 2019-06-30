import { Config } from './config'
import { create } from './util/logger'
import { start } from './mod'
import path from 'path'
import dotenv from 'dotenv-safe'

require('perish')

const projectRootDirname = path.resolve(__dirname, '..')
const uiHtmlEntryFilename = path.resolve(
  projectRootDirname,
  './src/ui/index.html'
)
const staticDirname = path.resolve(projectRootDirname, 'public')

dotenv.load({
  path: path.resolve(projectRootDirname, `.env.${process.env.NODE_ENV}`)
})
const config: Config = {
  analyzerApiEndpoint:
    process.env.ANALYZER_API_ENDPOINT || 'http://localhost:8080/fakebox/check',
  logLevel: (process.env.LOG_LEVEL as any) || 'info',
  port: process.env.PORT ? parseInt(process.env.PORT) : 7777,
  scraperApiEndpoint:
    process.env.SCRAPER_API_ENDPOINT || 'http://localhost:38765/',
  paths: {
    projectRootDirname,
    staticDirname,
    uiHtmlEntryFilename
  }
}

start(config, { logger: create({ level: config.logLevel }) })
