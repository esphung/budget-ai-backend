import { Database } from 'sqlite3';
import { AccountsRepository } from '../repositories/AccountRepository';
import { Account } from '../types/Account';
import { AbstractController } from './AbstractController';
import { DatabaseController } from './DatabaseController';

export class AccountsController
	extends DatabaseController
	implements AbstractController
{
	private repo: AccountsRepository;

	constructor(db: Database) {
		super(db);
		this.repo = new AccountsRepository(db);
	}

	getAllAccounts() {
		return this.repo.getAll();
	}

	createAccount(
		data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'> & {
			id?: string;
			createdAt?: string;
			updatedAt?: string;
		}
	) {
		return this.repo.create(data);
	}

	updateAccount(id: string, data: Omit<Partial<Account>, 'id'>) {
		return this.repo.update(id, data);
	}

	deleteAccount(id: string) {
		return this.repo.delete(id);
	}

	clearAccounts() {
		return this.repo.clear();
	}
}
