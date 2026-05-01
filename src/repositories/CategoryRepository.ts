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

	delete(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db.run('DELETE FROM categories WHERE id = ?', [id], (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	getAll(): Promise<Category[]> {
		return new Promise((resolve, reject) => {
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

	getById(id: string): Promise<Category | null> {
		return new Promise((resolve, reject) => {
			this.db.get(
				'SELECT * FROM categories WHERE id = ?',
				[id],
				(err, row: RowCategory) => {
					if (err) {
						reject(err);
					} else if (row) {
						resolve(mapRowToCategory(row));
					} else {
						resolve(null);
					}
				}
			);
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

	update(id: string, item: Partial<Category>): Promise<Category> {
		return new Promise((resolve, reject) => {
			this.db.get(
				'SELECT * FROM categories WHERE id = ?',
				[id],
				(err, row: RowCategory) => {
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
				}
			);
		});
	}

	clear(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db.run('DELETE FROM categories', (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}
