import knex from 'knex'
import { join as joinPath } from 'path'

const DB_PATH = joinPath(
  __dirname.replace(/\/\.next\/.+/, ''),
  './data/db.sqlite3'
)

export const getDb = () =>
  knex({
    client: 'sqlite3',
    connection: {
      filename: DB_PATH,
    },
    useNullAsDefault: true,
  })
