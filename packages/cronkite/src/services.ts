import { Logger } from './util/logger'
import Knex from 'knex'
import { AnalysisResult } from './common'
import { Pool } from 'pg'

export type Services = {
  pool: Pool
  logger: Logger
  knex: Knex<AnalysisResult>
}
