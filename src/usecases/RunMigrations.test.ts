import sqlite3 from 'sqlite3';
import { runMigrations } from './RunMigrations';
import { open } from 'sqlite';

describe('RunMigrations', () => {
	let db;

	beforeAll(async () => {
		db = await open({
			filename: ':memory:', // Use in-memory database for testing
			driver: sqlite3.Database,
		});
	});

	afterAll(async () => {
		await db.close();
	});

	test('should create all required tables', async () => {
		const migrations = new runMigrations(db);
		migrations.execute();

		const tables = [
			'users',
			'accounts',
			'ai_threads',
			'ai_messages',
			'ai_actions',
			'transactions',
			'categories',
			'budgets',
		];

		for (const table of tables) {
			const result = await db.get(
				`SELECT name FROM sqlite_master WHERE type='table' AND name='${table}';`
			);
			expect(result).toBeDefined();
			expect(result.name).toBe(table);
		}
	});

	test('should enforce valid accounts account_type values', async () => {
		const migrations = new runMigrations(db);
		migrations.execute();

		const schemaRow = await db.get(
			"SELECT sql FROM sqlite_master WHERE type='table' AND name='accounts';"
		);
		expect(schemaRow).toBeDefined();
		expect(schemaRow.sql).toContain('account_type TEXT NOT NULL CHECK');
		expect(schemaRow.sql).toContain("'cash'");
		expect(schemaRow.sql).toContain("'checking'");
		expect(schemaRow.sql).toContain("'savings'");
		expect(schemaRow.sql).toContain("'credit'");
		expect(schemaRow.sql).toContain("'investment'");
		expect(schemaRow.sql).toContain("'other'");
	});
});
