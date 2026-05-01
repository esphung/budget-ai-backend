import { Database } from 'sqlite3';
import { AbstractController } from './AbstractController';

export class DatabaseController extends AbstractController {
	constructor(db: Database) {
		super(db);
	}

	// Define common database operations here, e.g., create, read, update, delete (CRUD)
	create(table: string, data: Record<string, any>) {
		const columns = Object.keys(data).join(', ');
		const placeholders = Object.keys(data)
			.map(() => '?')
			.join(', ');
		const values = Object.values(data);
		const stmt = this.db.prepare(
			`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
		);
		stmt.run(values);
	}

	read(table: string, conditions: Record<string, any> = {}): any[] {
		let query = `SELECT * FROM ${table}`;
		const values = Object.values(conditions);
		if (values.length > 0) {
			const whereClauses = Object.keys(conditions)
				.map((key) => `${key} = ?`)
				.join(' AND ');
			query += ` WHERE ${whereClauses}`;
		}
		const stmt = this.db.prepare(query);
		// return stmt.all(values);
		return stmt.all(values) as unknown as any[]; // Cast to any[] to satisfy return type
	}

	update(
		table: string,
		data: Record<string, any>,
		conditions: Record<string, any>
	) {
		const setClauses = Object.keys(data)
			.map((key) => `${key} = ?`)
			.join(', ');
		const whereClauses = Object.keys(conditions)
			.map((key) => `${key} = ?`)
			.join(' AND ');
		const values = [...Object.values(data), ...Object.values(conditions)];
		const stmt = this.db.prepare(
			`UPDATE ${table} SET ${setClauses} WHERE ${whereClauses}`
		);
		stmt.run(values);
	}

	delete(table: string, conditions: Record<string, any>) {
		const whereClauses = Object.keys(conditions)
			.map((key) => `${key} = ?`)
			.join(' AND ');
		const values = Object.values(conditions);
		const stmt = this.db.prepare(
			`DELETE FROM ${table} WHERE ${whereClauses}`
		);
		stmt.run(values);
	}

	clear(table: string) {
		const stmt = this.db.prepare(`DELETE FROM ${table}`);
		stmt.run();
	}
}
