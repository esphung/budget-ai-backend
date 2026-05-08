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

	getAllBudgets(ownerId?: string) {
		if (ownerId) {
			return this.repo.getAll(ownerId);
		}

		return this.repo.getAll();
	}

	createBudget(
		data: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'> & {
			id?: string;
			createdAt?: string;
			updatedAt?: string;
		},
		ownerId?: string
	) {
		return this.repo.create({ ...data, ownerId: ownerId ?? data.ownerId });
	}

	updateBudget(
		id: string,
		data: Omit<Partial<Budget>, 'id'>,
		ownerId?: string
	) {
		if (ownerId) {
			return this.repo.update(id, data, ownerId);
		}

		return this.repo.update(id, data);
	}

	deleteBudget(id: string, ownerId?: string) {
		if (ownerId) {
			return this.repo.delete(id, ownerId);
		}

		return this.repo.delete(id);
	}

	clearBudgets(ownerId?: string) {
		if (ownerId) {
			return this.repo.clear(ownerId);
		}

		return this.repo.clear();
	}
}
