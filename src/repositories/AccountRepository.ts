import { Database } from 'sqlite3';
import { BaseRepository } from '../types/BaseRepository';
import type { Account, RowAccount } from '../types/Account';
import { generateUniqueId } from '../utils/RandomUtils';

const mapRowToAccount = (row: RowAccount): Account => {
	return {
		id: row.id,
		name: row.name,
		accountType: row.account_type as Account['accountType'],
		currency: row.currency,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
};

export class AccountsRepository implements BaseRepository<Account> {
	constructor(private db: Database) {}

	delete(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db.run('DELETE FROM accounts WHERE id = ?', [id], (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	getAll(): Promise<Account[]> {
		let accounts: Account[] = [];
		return new Promise((resolve, reject) => {
			this.db.all('SELECT * FROM accounts', (err, rows: RowAccount[]) => {
				if (err) {
					reject(err);
				} else {
					accounts = rows.map(mapRowToAccount);
					resolve(accounts);
				}
			});
		});
	}

	getById(id: string): Promise<Account | null> {
		let account: Account | null = null;
		return new Promise((resolve, reject) => {
			this.db.get(
				'SELECT * FROM accounts WHERE id = ?',
				[id],
				(err, row: RowAccount) => {
					if (err) {
						reject(err);
					} else if (row) {
						account = mapRowToAccount(row);
						resolve(account);
					} else {
						resolve(null);
					}
				}
			);
		});
	}

	create(item: Partial<Account>): Promise<Account> {
		let createdAccount: Account;
		return new Promise((resolve, reject) => {
			const id = item.id || generateUniqueId('acct');
			const now = new Date().toISOString();

			this.db.run(
				'INSERT INTO accounts (id, name, account_type, currency, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
				[
					id,
					item.name,
					item.accountType || 'other',
					item.currency || 'USD',
					item.createdAt || now,
					item.updatedAt || now,
				],
				(err) => {
					if (err) {
						reject(err);
					} else {
						createdAccount = mapRowToAccount({
							id,
							name: item.name || '',
							account_type: item.accountType || 'other',
							currency: item.currency || 'USD',
							created_at: item.createdAt || now,
							updated_at: item.updatedAt || now,
						} satisfies RowAccount);
						resolve(createdAccount);
					}
				}
			);
		});
	}

	update(id: string, item: Partial<Account>): Promise<Account> {
		return new Promise((resolve, reject) => {
			const existingAccountPromise = new Promise<RowAccount>(
				(res, rej) => {
					this.db.get(
						'SELECT * FROM accounts WHERE id = ?',
						[id],
						(err, row: RowAccount) => {
							if (err) {
								rej(err);
							} else if (row) {
								res(row);
							} else {
								rej(new Error('Account not found'));
							}
						}
					);
				}
			);

			existingAccountPromise
				.then((existingRow) => {
					const existingAccount = mapRowToAccount(existingRow);
					const mergedAccount: Account = {
						...existingAccount,
						...item,
						id,
					};

					this.db.run(
						'UPDATE accounts SET name = ?, account_type = ?, currency = ?, created_at = ?, updated_at = ? WHERE id = ?',
						[
							mergedAccount.name,
							mergedAccount.accountType,
							mergedAccount.currency,
							mergedAccount.createdAt,
							mergedAccount.updatedAt,
							id,
						],
						(err) => {
							if (err) {
								reject(err);
							} else {
								resolve(mergedAccount);
							}
						}
					);
				})
				.catch(reject);
		});
	}

	clear(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db.run('DELETE FROM accounts', (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}
