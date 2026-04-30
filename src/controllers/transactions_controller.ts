import { DatabaseController } from './database_controller';
import { Database } from 'sqlite3';

export type TransactionType = 'expense' | 'income' | 'transfer';

export type Transaction = {
	id: string;
	accountId: string | null;
	amount: number;
	merchant: string | null;
	category: string | null;
	transactionType: TransactionType;
	date: string;
	source: 'ai' | 'manual';
	rawUserText?: string;
	syncStatus?: 'pending' | 'synced';
	createdAt: string;
};

export class TransactionsController extends DatabaseController {
	constructor(db: Database) {
		super(db);
	}

	getAllTransactions(): Transaction[] {
		return this.read('transactions');
	}

	createTransaction(data: Record<string, any>) {
		this.create('transactions', data);
	}

	updateTransaction(id: string, data: Record<string, any>) {
		this.update('transactions', data, { id });
	}

	deleteTransaction(id: string) {
		this.delete('transactions', { id });
	}
}
