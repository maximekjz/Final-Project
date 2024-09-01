import { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: PGHOST,
      port: 5432,
      user: PGUSER,
      database: PGDATABASE,
      password: PGPASSWORD,
      ssl: { rejectUnauthorized: false },
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: PGHOST,
      port: 5432,
      user: PGUSER,
      database: PGDATABASE,
      password: PGPASSWORD,
      ssl: { rejectUnauthorized: false },
    },
  },
};

module.exports = config;
