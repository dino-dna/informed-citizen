import { Logger } from './util/logger'
import Knex from 'knex'
import { AnalysisResult } from './common'
import { Pool } from 'pg'
import { create } from './services/reporter'

export type Services = {
  pool: Pool
  logger: Logger
  knex: Knex<AnalysisResult>
  reporter: ReturnType<typeof create>
}
