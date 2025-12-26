import sqlite3 from 'sqlite3'
import path from 'path'

export let db: sqlite3.Database

export function initDB(__dirname: string) {
  const dbPath = path.join(__dirname, '..', 'data', 'stocker.sqlite')

  db = new sqlite3.Database(dbPath)

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        quantity INTEGER DEFAULT 0,
        price REAL NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)
  })

  console.log('Database initialized at', dbPath)
  return db
}

export function getDB() {
  if (!db) throw new Error('DB not initialized')
  return db
}
