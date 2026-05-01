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

	getAllCategories() {
		return this.repo.getAll();
	}

	createCategory(
		data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'> & {
			id?: string;
			createdAt?: string;
			updatedAt?: string;
		}
	) {
		return this.repo.create(data);
	}

	updateCategory(id: string, data: Omit<Partial<Category>, 'id'>) {
		return this.repo.update(id, data);
	}

	deleteCategory(id: string) {
		return this.repo.delete(id);
	}

	clearCategories() {
		return this.repo.clear();
	}
}
