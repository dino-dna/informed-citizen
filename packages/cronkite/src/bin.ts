import 'perish'
import { create } from './util/logger'
import { create as createReporter } from './services/reporter'
import { get } from './config'
import { isDev } from './common'
import { Pool } from 'pg'
import { pruneEnv as pruneEnvSecrets } from './util/secrets'
import { Services } from './services'
import { start } from './server'
import dotenv from 'dotenv-safe'
import knexConfig from '../knexfile'
import knexInitializer from 'knex'
import path from 'path'

require('isomorphic-fetch')

const projectRootDirname = path.resolve(__dirname, '..')
const uiHtmlEntryFilename = path.resolve(projectRootDirname, './src/ui/index.html')
const staticDirname = path.resolve(projectRootDirname, 'public')
const envFilename = path.resolve(projectRootDirname, `.env.${process.env.NODE_ENV}`)

dotenv.load({ path: envFilename })

const config = get({
  isDev,
  paths: {
    projectRootDirname,
    staticDirname,
    uiHtmlEntryFilename
  }
})
const knex = knexInitializer(knexConfig)
pruneEnvSecrets()

const pool = new Pool(config.db)
const partialServices: Services = {
  knex,
  logger: create({
    level: config.logLevel,
    prettyPrint: config.logPrettyPrint
  }),
  pool,
  reporter: null as any
}
const services: Services = {
  ...partialServices,
  reporter: createReporter(config, partialServices)
}
start(config, services)
