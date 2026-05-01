/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { AccountsRepository } from './AccountRepository';

describe('AccountsRepository', () => {
	let db: any;
	let repo: AccountsRepository;

	beforeEach(() => {
		db = {
			run: jest.fn((sql: string, params: any, cb?: Function) => {
				if (typeof params === 'function') {
					cb = params;
				}
				cb && cb.call({ lastID: '1' }, null);
				return this;
			}),
			all: jest.fn((sql: string, cb: Function) => cb(null, [])),
			get: jest.fn((sql: string, params: any, cb: Function) =>
				cb(null, null)
			),
		} as any;
		repo = new AccountsRepository(db as any);
	});

	it('getAll returns accounts', async () => {
		db.all.mockImplementation(function (
			this: any,
			sql: string,
			params: any,
			cb?: Function
		) {
			if (typeof params === 'function') {
				cb = params;
			}
			cb &&
				cb.call(this, null, [
					{
						id: '1',
						name: 'Checking',
						account_type: 'checking',
						currency: 'USD',
						created_at: '',
						updated_at: '',
					},
				]);
			return this;
		});
		const result = await repo.getAll();
		expect(result[0].id).toBe('1');
	});

	it('getById returns account', async () => {
		db.get.mockImplementation(function (
			this: any,
			sql: string,
			params: any,
			cb?: Function
		) {
			if (typeof params === 'function') {
				cb = params;
			}
			cb &&
				cb.call(this, null, {
					id: '2',
					name: 'Savings',
					account_type: 'savings',
					currency: 'USD',
					created_at: '',
					updated_at: '',
				});
			return this;
		});
		const result = await repo.getById('2');
		expect(result?.id).toBe('2');
	});

	it('create inserts and returns account', async () => {
		const data = {
			name: 'Cash Wallet',
			accountType: 'cash' as const,
			currency: 'USD',
			createdAt: '',
			updatedAt: '',
		};
		const result = await repo.create(data);
		expect(result.name).toBe('Cash Wallet');
	});

	it('update updates and returns account', async () => {
		db.get.mockImplementationOnce(function (
			this: any,
			sql: string,
			params: any,
			cb?: Function
		) {
			if (typeof params === 'function') {
				cb = params;
			}
			cb &&
				cb.call(this, null, {
					id: '4',
					name: 'Brokerage',
					account_type: 'investment',
					currency: 'USD',
					created_at: '',
					updated_at: '',
				});
			return this;
		});
		const data = {
			name: 'Brokerage Updated',
			accountType: 'investment' as const,
			currency: 'USD',
			createdAt: '',
			updatedAt: '',
		};
		const result = await repo.update('4', data);
		expect(result.name).toBe('Brokerage Updated');
	});

	it('delete removes account', async () => {
		await expect(repo.delete('5')).resolves.toBeUndefined();
		expect(db.run).toHaveBeenCalled();
	});

	it('clear removes all accounts', async () => {
		await expect(repo.clear()).resolves.toBeUndefined();
		expect(db.run).toHaveBeenCalledWith(
			'DELETE FROM accounts',
			expect.any(Function)
		);
	});
});
