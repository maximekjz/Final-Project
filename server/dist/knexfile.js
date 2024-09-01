"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const config = {
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
