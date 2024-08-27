const knex = require("knex");
require("dotenv").config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

module.exports = {
  db: knex({
    client: "pg",
    connection: {
      host: PGHOST,
      port: 5432,
      user: PGUSER,
      database: PGDATABASE,
      password: PGPASSWORD,
      ssl: { rejectUnauthorized: false },
    },
  }),
};
