import * as Knex from 'knex'

const { CRONKITE_DB_USER } = process.env

export async function up (knex: Knex): Promise<any> {
  await knex.raw(`
    grant all privileges on all tables in schema public to ${CRONKITE_DB_USER};
  `)
}

export async function down (knex: Knex): Promise<any> {}
