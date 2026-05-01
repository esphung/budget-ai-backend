import { Database } from 'sqlite3';
import { BaseRepository } from '../types/BaseRepository';
import type { Budget, RowBudget } from '../types/Budget';
import { generateUniqueId } from '../utils/RandomUtils';

const mapRowToBudget = (row: RowBudget): Budget => {
	return {
		id: row.id,
		name: row.name,
		amount: row.amount,
		categoryId: row.category_id,
		periodStart: row.period_start,
		periodEnd: row.period_end,
		ownerId: row.owner_id,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
};

export class BudgetsRepository implements BaseRepository<Budget> {
	constructor(private db: Database) {}

	delete(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db.run('DELETE FROM budgets WHERE id = ?', [id], (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	getAll(): Promise<Budget[]> {
		return new Promise((resolve, reject) => {
			this.db.all('SELECT * FROM budgets', (err, rows: RowBudget[]) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows.map(mapRowToBudget));
				}
			});
		});
	}

	getById(id: string): Promise<Budget | null> {
		return new Promise((resolve, reject) => {
			this.db.get(
				'SELECT * FROM budgets WHERE id = ?',
				[id],
				(err, row: RowBudget) => {
					if (err) {
						reject(err);
					} else if (row) {
						resolve(mapRowToBudget(row));
					} else {
						resolve(null);
					}
				}
			);
		});
	}

	create(item: Partial<Budget>): Promise<Budget> {
		return new Promise((resolve, reject) => {
			const id = item.id || generateUniqueId('bgt');
			const now = new Date().toISOString();

			this.db.run(
				'INSERT INTO budgets (id, name, amount, category_id, period_start, period_end, owner_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[
					id,
					item.name,
					item.amount ?? 0,
					item.categoryId ?? null,
					item.periodStart,
					item.periodEnd,
					item.ownerId ?? null,
					item.createdAt || now,
					item.updatedAt || now,
				],
				(err) => {
					if (err) {
						reject(err);
					} else {
						resolve(
							mapRowToBudget({
								id,
								name: item.name || '',
								amount: item.amount ?? 0,
								category_id: item.categoryId ?? null,
								period_start: item.periodStart || '',
								period_end: item.periodEnd || '',
								owner_id: item.ownerId ?? null,
								created_at: item.createdAt || now,
								updated_at: item.updatedAt || now,
							} satisfies RowBudget)
						);
					}
				}
			);
		});
	}

	update(id: string, item: Partial<Budget>): Promise<Budget> {
		return new Promise((resolve, reject) => {
			this.db.get(
				'SELECT * FROM budgets WHERE id = ?',
				[id],
				(err, row: RowBudget) => {
					if (err) return reject(err);
					if (!row) return reject(new Error('Budget not found'));

					const existing = mapRowToBudget(row);
					const merged: Budget = { ...existing, ...item, id };

					this.db.run(
						'UPDATE budgets SET name = ?, amount = ?, category_id = ?, period_start = ?, period_end = ?, owner_id = ?, created_at = ?, updated_at = ? WHERE id = ?',
						[
							merged.name,
							merged.amount,
							merged.categoryId,
							merged.periodStart,
							merged.periodEnd,
							merged.ownerId,
							merged.createdAt,
							merged.updatedAt,
							id,
						],
						(updateErr) => {
							if (updateErr) {
								reject(updateErr);
							} else {
								resolve(merged);
							}
						}
					);
				}
			);
		});
	}

	clear(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db.run('DELETE FROM budgets', (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}
