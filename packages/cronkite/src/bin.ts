import { Config } from './config'
import { create } from './util/logger'
import { start } from './server'
import path from 'path'
import dotenv from 'dotenv-safe'
import knexConfig from '../knexfile'
import knexInitializer from 'knex'

require('perish')

const projectRootDirname = path.resolve(__dirname, '..')
const uiHtmlEntryFilename = path.resolve(projectRootDirname, './src/ui/index.html')
const staticDirname = path.resolve(projectRootDirname, 'public')

dotenv.load({
  path: path.resolve(projectRootDirname, `.env.${process.env.NODE_ENV}`)
})
const config: Config = {
  analyzerApiEndpoint: process.env.ANALYZER_API_ENDPOINT || 'http://localhost:8080/fakebox/check',
  db: {
    user: process.env.CRONKITE_DB_USER!,
    database: process.env.POSTGRES_DB!,
    password: process.env.CRONKITE_DB_PASSWORD!,
    port: 5432,
    host: process.env.DB_HOST || '127.0.0.1',
    application_name: 'informed'
  },
  logLevel: (process.env.LOG_LEVEL as any) || 'info',
  origin: process.env.ORIGIN!,
  facebookApiId: process.env.FACEBOOK_APP_ID || '',
  paths: {
    projectRootDirname,
    staticDirname,
    uiHtmlEntryFilename
  },
  port: process.env.PORT ? parseInt(process.env.PORT) : 7777,
  scraperApiEndpoint: process.env.SCRAPER_API_ENDPOINT || 'http://localhost:38765/'
}

const knex = knexInitializer(knexConfig)
Object.keys(process.env).forEach(key => {
  if (key.match(/cronkite|postgres|mb_key/i)) delete process.env[key]
})
start(config, { logger: create({ level: config.logLevel }), knex })
