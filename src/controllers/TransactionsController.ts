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

	getAllTransactions() {
		return this.repo.getAll();
	}

	createTransaction(
		data: Omit<Transaction, 'id' | 'createdAt'> & {
			id?: string;
			createdAt?: string;
		}
	) {
		return this.repo.create(data);
	}

	updateTransaction(id: string, data: Omit<Partial<Transaction>, 'id'>) {
		return this.repo.update(id, data);
	}

	deleteTransaction(id: string) {
		return this.repo.delete(id);
	}

	clearTransactions() {
		return this.repo.clear();
	}
}
