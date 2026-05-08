import { Database } from 'sqlite3';
import { BaseRepository } from '../types/BaseRepository';
import type { Category, RowCategory } from '../types/Category';
import { generateUniqueId } from '../utils/RandomUtils';

const mapRowToCategory = (row: RowCategory): Category => {
	return {
		id: row.id,
		name: row.name,
		color: row.color,
		icon: row.icon,
		ownerId: row.owner_id,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
};

export class CategoriesRepository implements BaseRepository<Category> {
	constructor(private db: Database) {}

	delete(id: string, ownerId?: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const sql = ownerId
				? 'DELETE FROM categories WHERE id = ? AND owner_id = ?'
				: 'DELETE FROM categories WHERE id = ?';
			const params = ownerId ? [id, ownerId] : [id];
			this.db.run(sql, params, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	getAll(ownerId?: string): Promise<Category[]> {
		return new Promise((resolve, reject) => {
			if (ownerId) {
				this.db.all(
					'SELECT * FROM categories WHERE owner_id = ?',
					[ownerId],
					(err, rows: RowCategory[]) => {
						if (err) {
							reject(err);
						} else {
							resolve(rows.map(mapRowToCategory));
						}
					}
				);
				return;
			}

			this.db.all(
				'SELECT * FROM categories',
				(err, rows: RowCategory[]) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows.map(mapRowToCategory));
					}
				}
			);
		});
	}

	getById(id: string, ownerId?: string): Promise<Category | null> {
		return new Promise((resolve, reject) => {
			const sql = ownerId
				? 'SELECT * FROM categories WHERE id = ? AND owner_id = ?'
				: 'SELECT * FROM categories WHERE id = ?';
			const params = ownerId ? [id, ownerId] : [id];
			this.db.get(sql, params, (err, row: RowCategory) => {
				if (err) {
					reject(err);
				} else if (row) {
					resolve(mapRowToCategory(row));
				} else {
					resolve(null);
				}
			});
		});
	}

	create(item: Partial<Category>): Promise<Category> {
		return new Promise((resolve, reject) => {
			const id = item.id || generateUniqueId('cat');
			const now = new Date().toISOString();

			this.db.run(
				'INSERT INTO categories (id, name, color, icon, owner_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
				[
					id,
					item.name,
					item.color ?? null,
					item.icon ?? null,
					item.ownerId ?? null,
					item.createdAt || now,
					item.updatedAt || now,
				],
				(err) => {
					if (err) {
						reject(err);
					} else {
						resolve(
							mapRowToCategory({
								id,
								name: item.name || '',
								color: item.color ?? null,
								icon: item.icon ?? null,
								owner_id: item.ownerId ?? null,
								created_at: item.createdAt || now,
								updated_at: item.updatedAt || now,
							} satisfies RowCategory)
						);
					}
				}
			);
		});
	}

	update(
		id: string,
		item: Partial<Category>,
		ownerId?: string
	): Promise<Category> {
		return new Promise((resolve, reject) => {
			const fetchSql = ownerId
				? 'SELECT * FROM categories WHERE id = ? AND owner_id = ?'
				: 'SELECT * FROM categories WHERE id = ?';
			const fetchParams = ownerId ? [id, ownerId] : [id];
			this.db.get(fetchSql, fetchParams, (err, row: RowCategory) => {
				if (err) return reject(err);
				if (!row) return reject(new Error('Category not found'));

				const existing = mapRowToCategory(row);
				const merged: Category = { ...existing, ...item, id };

				this.db.run(
					'UPDATE categories SET name = ?, color = ?, icon = ?, owner_id = ?, created_at = ?, updated_at = ? WHERE id = ?',
					[
						merged.name,
						merged.color,
						merged.icon,
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
			});
		});
	}

	clear(ownerId?: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const onComplete = (err: Error | null) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			};

			if (ownerId) {
				this.db.run(
					'DELETE FROM categories WHERE owner_id = ?',
					[ownerId],
					onComplete
				);
				return;
			}

			this.db.run('DELETE FROM categories', onComplete);
		});
	}
}
