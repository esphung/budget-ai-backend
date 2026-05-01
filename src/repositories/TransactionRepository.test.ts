/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { TransactionsRepository } from './TransactionRepository';

describe('TransactionsRepository', () => {
	let db: any;
	let repo: TransactionsRepository;

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
		repo = new TransactionsRepository(db as any);
	});

	it('getAll returns transactions', async () => {
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
						account_id: 'a',
						amount: 1,
						date: '',
						merchant: '',
						category: '',
						transaction_type: 'expense',
						source: 'manual',
						created_at: '',
					},
				]);
			return this;
		});
		const result = await repo.getAll();
		expect(result[0].id).toBe('1');
	});

	it('getById returns transaction', async () => {
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
					account_id: 'a',
					amount: 2,
					date: '',
					merchant: '',
					category: '',
					transaction_type: 'income',
					source: 'manual',
					created_at: '',
				});
			return this;
		});
		const result = await repo.getById('2');
		expect(result?.id).toBe('2');
	});

	it('create inserts and returns transaction', async () => {
		const data = {
			accountId: 'a',
			amount: 3,
			merchant: '',
			category: '',
			transactionType: 'expense' as const,
			date: '',
			source: 'manual' as const,
			createdAt: '',
		};
		const result = await repo.create(data);
		expect(result.accountId).toBe('a');
	});

	it('update updates and returns transaction', async () => {
		// Mock db.get to return a valid transaction for update
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
					account_id: 'a',
					amount: 4,
					date: '',
					merchant: '',
					category: '',
					transaction_type: 'income',
					source: 'manual',
					created_at: '',
				});
			return this;
		});
		const data = {
			accountId: 'a',
			amount: 4,
			merchant: '',
			category: '',
			transactionType: 'income' as const,
			date: '',
			source: 'manual' as const,
			createdAt: '',
		};
		const result = await repo.update('4', data);
		expect(result.amount).toBe(4);
	});

	it('delete removes transaction', async () => {
		await expect(repo.delete('5')).resolves.toBeUndefined();
		expect(db.run).toHaveBeenCalled();
	});

	it('clear removes all transactions', async () => {
		await expect(repo.clear()).resolves.toBeUndefined();
		expect(db.run).toHaveBeenCalledWith(
			'DELETE FROM transactions',
			expect.any(Function)
		);
	});
});
