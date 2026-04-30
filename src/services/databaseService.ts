import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { runMigrations } from '../usecases/RunMigrations';

async function initDb() {
	const { db } = await open({
		filename: './database.db',
		driver: sqlite3.Database,
	});

	// run migrations or create tables if they don't exist
	new runMigrations(db).execute();

	return db;
}

export { initDb };
