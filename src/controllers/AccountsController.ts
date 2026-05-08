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

	getAllAccounts(ownerId?: string) {
		if (ownerId) {
			return this.repo.getAll(ownerId);
		}

		return this.repo.getAll();
	}

	createAccount(
		data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'> & {
			id?: string;
			createdAt?: string;
			updatedAt?: string;
		},
		ownerId?: string
	) {
		return this.repo.create({ ...data, ownerId: ownerId ?? data.ownerId });
	}

	updateAccount(
		id: string,
		data: Omit<Partial<Account>, 'id'>,
		ownerId?: string
	) {
		if (ownerId) {
			return this.repo.update(id, data, ownerId);
		}

		return this.repo.update(id, data);
	}

	deleteAccount(id: string, ownerId?: string) {
		if (ownerId) {
			return this.repo.delete(id, ownerId);
		}

		return this.repo.delete(id);
	}

	clearAccounts(ownerId?: string) {
		if (ownerId) {
			return this.repo.clear(ownerId);
		}

		return this.repo.clear();
	}
}
