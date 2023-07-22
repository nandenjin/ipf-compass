import { AsyncDatabase } from 'promised-sqlite3'
import { join as joinPath } from 'path'

const DB_PATH = joinPath(
  __dirname.replace(/\/\.next\/.+/, ''),
  './data/db.sqlite3'
)

export const getDb = () => AsyncDatabase.open(DB_PATH)
