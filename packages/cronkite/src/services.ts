import { Logger } from './util/logger'
import Knex from 'knex'
import { AnalysisResult } from './common'

export type Services = {
  logger: Logger
  knex: Knex<AnalysisResult>
}
