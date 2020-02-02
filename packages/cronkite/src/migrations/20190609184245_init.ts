import * as Knex from 'knex'

const { POSTGRES_DB, CRONKITE_DB_PASSWORD, CRONKITE_DB_USER } = process.env

export async function up (knex: Knex): Promise<any> {
  await knex.raw(`
    create user ${CRONKITE_DB_USER} with encrypted password '${CRONKITE_DB_PASSWORD}';
  `)
  await knex.raw(`
    create table analyses (
      id serial primary key,
      requested_urlkey varchar not null,
      scraped_urlkey varchar not null,
      report jsonb not null
    );
  `)
  await knex.raw(`create unique index requested_urlkey_idx on analyses (requested_urlkey)`)
  await knex.raw(`create unique index scraped_urlkey_idx on analyses (scraped_urlkey)`)
  await knex.raw(`
    create table analyze_queue (
      id serial primary key,
      source_url varchar not null
    );
  `)
  await knex.raw(`
    grant all privileges on database ${POSTGRES_DB} to ${CRONKITE_DB_USER};
    grant all privileges on all tables in schema public to ${CRONKITE_DB_USER};
    grant all on all sequences in schema public to ${CRONKITE_DB_USER};
    grant execute on all functions in schema public to ${CRONKITE_DB_USER};
  `)
}

export async function down (knex: Knex): Promise<any> {
  await knex.raw(`
    revoke execute on all functions in schema public from ${CRONKITE_DB_USER};
    revoke all on all sequences in schema public from ${CRONKITE_DB_USER};
    revoke all privileges on all tables in schema public from ${CRONKITE_DB_USER};
    revoke all privileges on database ${POSTGRES_DB} from ${CRONKITE_DB_USER};
    drop user ${CRONKITE_DB_USER};
    drop table analyses cascade;
    drop table analyze_queue;
  `)
}
