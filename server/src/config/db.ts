import knex, { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config({path: '../.env'});

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
  throw new Error('Database environment variables are not set');
}

export const db: Knex = knex({
  client: 'pg',
  connection: {
    host: PGHOST,
    port: 5432,
    user: PGUSER,
    database: PGDATABASE,
    password: PGPASSWORD,
    ssl: { rejectUnauthorized: false },
  },
});
