import { Database } from 'sqlite3';
import { TransactionsRepository } from '../repositories/TransactionRepository';
import { Transaction } from '../types/Transaction';
import { AbstractController } from './AbstractController';
import { DatabaseController } from './DatabaseController';

export class TransactionsController
	extends DatabaseController
	implements AbstractController
{
	private repo: TransactionsRepository;

	constructor(db: Database) {
		super(db);
		this.repo = new TransactionsRepository(db);
	}

	getAllTransactions(ownerId?: string) {
		if (ownerId) {
			return this.repo.getAll(ownerId);
		}

		return this.repo.getAll();
	}

	createTransaction(
		data: Omit<Transaction, 'id' | 'createdAt'> & {
			id?: string;
			createdAt?: string;
		},
		ownerId?: string
	) {
		return this.repo.create({ ...data, ownerId: ownerId ?? data.ownerId });
	}

	updateTransaction(
		id: string,
		data: Omit<Partial<Transaction>, 'id'>,
		ownerId?: string
	) {
		if (ownerId) {
			return this.repo.update(id, data, ownerId);
		}

		return this.repo.update(id, data);
	}

	deleteTransaction(id: string, ownerId?: string) {
		if (ownerId) {
			return this.repo.delete(id, ownerId);
		}

		return this.repo.delete(id);
	}

	clearTransactions(ownerId?: string) {
		if (ownerId) {
			return this.repo.clear(ownerId);
		}

		return this.repo.clear();
	}
}
