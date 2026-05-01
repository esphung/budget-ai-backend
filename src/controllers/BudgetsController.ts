import { Database } from 'sqlite3';
import { BudgetsRepository } from '../repositories/BudgetRepository';
import { Budget } from '../types/Budget';
import { AbstractController } from './AbstractController';
import { DatabaseController } from './DatabaseController';

export class BudgetsController
	extends DatabaseController
	implements AbstractController
{
	private repo: BudgetsRepository;

	constructor(db: Database) {
		super(db);
		this.repo = new BudgetsRepository(db);
	}

	getAllBudgets() {
		return this.repo.getAll();
	}

	createBudget(
		data: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'> & {
			id?: string;
			createdAt?: string;
			updatedAt?: string;
		}
	) {
		return this.repo.create(data);
	}

	updateBudget(id: string, data: Omit<Partial<Budget>, 'id'>) {
		return this.repo.update(id, data);
	}

	deleteBudget(id: string) {
		return this.repo.delete(id);
	}

	clearBudgets() {
		return this.repo.clear();
	}
}
