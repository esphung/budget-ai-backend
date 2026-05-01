import { Database } from 'sqlite3';

export abstract class AbstractController {
	protected db: Database;
	constructor(db: Database) {
		this.db = db;
	}
	abstract create(table: string, data: Record<string, any>): void;
	abstract read(table: string, conditions?: Record<string, any>): any[];
	abstract update(
		table: string,
		data: Record<string, any>,
		conditions: Record<string, any>
	): void;
	abstract delete(table: string, conditions: Record<string, any>): void;
	abstract clear(table: string): void;
}
