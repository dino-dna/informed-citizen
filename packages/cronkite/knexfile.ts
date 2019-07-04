import { isDev } from './src/common'
import knex from 'knex'
import dotenv from 'dotenv-safe'
import { merge } from 'lodash'

const isMigrating = !!process.argv.some(arg => !!arg.match(/migrate:/))

dotenv.config()

const {
  CRONKITE_DB_USER,
  CRONKITE_DB_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_USER
} = process.env

const config: knex.Config = {
  client: 'pg',
  connection: {
    user: POSTGRES_USER,
    database: POSTGRES_DB,
    host: 'localhost',
    port: 5432,
    password: isMigrating ? POSTGRES_PASSWORD : ''
  },
  migrations: {
    database: POSTGRES_DB || '',
    directory: 'src/migrations',
    extension: 'ts'
  }
}

const developmentConfig: knex.Config = isDev
  ? {
    connection: {
      user: CRONKITE_DB_USER,
      password: CRONKITE_DB_PASSWORD
    }
  }
  : {}

export = merge({}, config, isMigrating ? {} : developmentConfig)
