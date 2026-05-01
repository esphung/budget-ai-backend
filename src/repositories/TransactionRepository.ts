import { Database } from 'sqlite3';
import { BaseRepository } from '../types/BaseRepository';
import type { RowTransaction, Transaction } from '../types/Transaction';
import { generateUniqueId } from '../utils/RandomUtils';

// Helper function to map database row to Transaction type
const mapRowToTransaction = (row: RowTransaction): Transaction => {
	return {
		id: row.id,
		accountId: row.account_id,
		amount: row.amount,
		date: row.date,
		merchant: row.merchant,
		category: row.category,
		transactionType: row.transaction_type as Transaction['transactionType'],
		source: row.source as Transaction['source'],
		ownerId: row.owner_id,
		createdAt: row.created_at,
	};
};

export class TransactionsRepository implements BaseRepository<Transaction> {
	constructor(private db: Database) {}

	delete(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db.run(
				'DELETE FROM transactions WHERE id = ?',
				[id],
				function (this: any, err) {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				}
			);
		});
	}

	// Example method to get transactions
	async getTransactions(): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.db.all('SELECT * FROM transactions', (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	getAll(): Promise<Transaction[]> {
		let transactions: Transaction[] = [];
		return new Promise((resolve, reject) => {
			this.db.all(
				'SELECT * FROM transactions',
				(err, rows: RowTransaction[]) => {
					if (err) {
						reject(err);
					} else {
						transactions = rows.map(mapRowToTransaction);
						resolve(transactions);
					}
				}
			);
		});
	}

	getById(id: string): Promise<Transaction | null> {
		let transaction: Transaction | null = null;
		return new Promise((resolve, reject) => {
			this.db.get(
				'SELECT * FROM transactions WHERE id = ?',
				[id],
				(err, row: RowTransaction) => {
					if (err) {
						reject(err);
					} else if (row) {
						transaction = mapRowToTransaction(row);
						resolve(transaction);
					} else {
						resolve(null);
					}
				}
			);
		});
	}

	create(item: Partial<Transaction>): Promise<Transaction> {
		let createdTransaction: Transaction;
		return new Promise((resolve, reject) => {
			this.db.run(
				'INSERT INTO transactions (id, account_id, amount, merchant, category, transaction_type, date, created_at, source, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[
					item.id || generateUniqueId('txn'),
					item.accountId,
					item.amount,
					item.merchant,
					item.category,
					item.transactionType || 'expense',
					item.date || new Date().toISOString(),
					item.createdAt || new Date().toISOString(),
					item.source || 'manual',
					item.ownerId ?? null,
				],
				function (this: any, err) {
					if (err) {
						reject(err);
					} else {
						createdTransaction = mapRowToTransaction({
							id: item.id || this.lastID,
							account_id: item.accountId || null,
							amount: item.amount || 0,
							date: item.date || new Date().toISOString(),
							merchant: item.merchant || null,
							category: item.category || null,
							transaction_type: item.transactionType || 'expense',
							source: item.source || 'manual',
							owner_id: item.ownerId ?? null,
							created_at:
								item.createdAt || new Date().toISOString(),
						} satisfies RowTransaction);
						resolve(createdTransaction);
					}
				}
			);
		});
	}

	update(id: string, item: Partial<Transaction>): Promise<Transaction> {
		return new Promise((resolve, reject) => {
			// First, we need to fetch the existing transaction to ensure we have all fields for the update
			const existingTransactionPromise = new Promise<RowTransaction>(
				(res, rej) => {
					this.db.get(
						'SELECT * FROM transactions WHERE id = ?',
						[id],
						(err, row: RowTransaction) => {
							if (err) {
								rej(err);
							} else if (row) {
								res(row);
							} else {
								rej(new Error('Transaction not found'));
							}
						}
					);
				}
			);

			existingTransactionPromise
				.then((existingRow) => {
					const existingTransaction =
						mapRowToTransaction(existingRow);
					// Merge existing transaction with new data
					const mergedTransaction: Transaction = {
						...existingTransaction,
						...item,
						id, // Ensure ID remains unchanged
					};

					this.db.run(
						'UPDATE transactions SET account_id = ?, amount = ?, date = ?, merchant = ?, category = ?, transaction_type = ?, source = ?, owner_id = ?, created_at = ? WHERE id = ?',
						[
							mergedTransaction.accountId,
							mergedTransaction.amount,
							mergedTransaction.date,
							mergedTransaction.merchant,
							mergedTransaction.category,
							mergedTransaction.transactionType,
							mergedTransaction.source,
							mergedTransaction.ownerId,
							mergedTransaction.createdAt,
							id,
						],
						function (this: any, err) {
							if (err) {
								reject(err);
							} else {
								resolve(mergedTransaction);
							}
						}
					);
				})
				.catch(reject);
		});
	}

	clear(): Promise<void> {
		console.log(
			'[TransactionsRepository] clear() called: Deleting all transactions'
		);
		return new Promise((resolve, reject) => {
			this.db.run('DELETE FROM transactions', function (this: any, err) {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}
