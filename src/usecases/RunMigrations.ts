import sqlite3 from 'sqlite3';

export class runMigrations {
	constructor(private db: sqlite3.Database) {}

	execute() {
		this.db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      account_type TEXT NOT NULL CHECK (
        account_type IN (
          'cash',
          'checking',
          'savings',
          'credit',
          'investment',
          'other'
        )
      ),
      currency TEXT NOT NULL DEFAULT 'USD',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_threads (
      id TEXT PRIMARY KEY,
      title TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_messages (
      id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK (
        role IN ('system', 'user', 'assistant', 'tool')
      ),
      message_type TEXT NOT NULL DEFAULT 'text' CHECK (
        message_type IN (
          'text',
          'action_request',
          'action_result',
          'error',
          'summary'
        )
      ),
      content TEXT,
      metadata_json TEXT,
      model TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (thread_id) REFERENCES ai_threads(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_actions (
      id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL,
      message_id TEXT NOT NULL,
      action_type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'applied', 'rejected', 'failed')
      ),
      result_json TEXT,
      error_message TEXT,
      created_at TEXT NOT NULL,
      applied_at TEXT,
      FOREIGN KEY (thread_id) REFERENCES ai_threads(id)
        ON DELETE CASCADE,
      FOREIGN KEY (message_id) REFERENCES ai_messages(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      account_id TEXT,
      amount REAL NOT NULL,
      merchant TEXT,
      category TEXT,
      transaction_type TEXT CHECK (
        transaction_type IN ('expense', 'income', 'transfer')
      ),
      date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      source TEXT,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
        ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      color TEXT,
      icon TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      category_id TEXT,
      period_start TEXT NOT NULL,
      period_end TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL
    );
  `);
	}
}
