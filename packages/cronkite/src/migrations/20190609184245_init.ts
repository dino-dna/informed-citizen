import * as Knex from 'knex'

const { POSTGRES_DB, CRONKITE_DB_PASSWORD, CRONKITE_DB_USER } = process.env

export async function up (knex: Knex): Promise<any> {
  await knex.raw(`
    create user ${CRONKITE_DB_USER} with encrypted password '${CRONKITE_DB_PASSWORD}';
  `)
  await knex.raw(`
    create table analyses (
      id serial primary key,
      urlkey varchar,
      report jsonb
    );
  `)
  await knex.raw(`create unique index urlkey_idx on analyses (urlkey)`)
  await knex.raw(`
    insert into analyses (urlkey, report) values
      ('htts://bad.org', '{"thing": 1, "thang": "zone"}'),
      ('htts://evil.net', '{"bad stuff": 1, "thang": "zone"}');;
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
  `)
}
