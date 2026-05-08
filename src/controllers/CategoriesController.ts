import { Database } from 'sqlite3';
import { CategoriesRepository } from '../repositories/CategoryRepository';
import { Category } from '../types/Category';
import { AbstractController } from './AbstractController';
import { DatabaseController } from './DatabaseController';

export class CategoriesController
	extends DatabaseController
	implements AbstractController
{
	private repo: CategoriesRepository;

	constructor(db: Database) {
		super(db);
		this.repo = new CategoriesRepository(db);
	}

	getAllCategories(ownerId?: string) {
		if (ownerId) {
			return this.repo.getAll(ownerId);
		}

		return this.repo.getAll();
	}

	createCategory(
		data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'> & {
			id?: string;
			createdAt?: string;
			updatedAt?: string;
		},
		ownerId?: string
	) {
		return this.repo.create({ ...data, ownerId: ownerId ?? data.ownerId });
	}

	updateCategory(
		id: string,
		data: Omit<Partial<Category>, 'id'>,
		ownerId?: string
	) {
		if (ownerId) {
			return this.repo.update(id, data, ownerId);
		}

		return this.repo.update(id, data);
	}

	deleteCategory(id: string, ownerId?: string) {
		if (ownerId) {
			return this.repo.delete(id, ownerId);
		}

		return this.repo.delete(id);
	}

	clearCategories(ownerId?: string) {
		if (ownerId) {
			return this.repo.clear(ownerId);
		}

		return this.repo.clear();
	}
}
