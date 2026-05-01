/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { BudgetsRepository } from './BudgetRepository';

describe('BudgetsRepository', () => {
	let db: any;
	let repo: BudgetsRepository;

	beforeEach(() => {
		db = {
			run: jest.fn((sql: string, params: any, cb?: Function) => {
				if (typeof params === 'function') cb = params;
				cb && cb.call({ lastID: '1' }, null);
				return this;
			}),
			all: jest.fn((sql: string, cb: Function) => cb(null, [])),
			get: jest.fn((sql: string, params: any, cb: Function) =>
				cb(null, null)
			),
		} as any;
		repo = new BudgetsRepository(db as any);
	});

	it('getAll returns budgets', async () => {
		db.all.mockImplementation(function (
			this: any,
			_sql: string,
			cb: Function
		) {
			cb(null, [
				{
					id: '1',
					name: 'Monthly Groceries',
					amount: 500,
					category_id: 'cat_1',
					period_start: '2026-04-01',
					period_end: '2026-04-30',
					created_at: '',
					updated_at: '',
				},
			]);
		});
		const result = await repo.getAll();
		expect(result[0].id).toBe('1');
		expect(result[0].amount).toBe(500);
	});

	it('getById returns budget', async () => {
		db.get.mockImplementation(function (
			this: any,
			_sql: string,
			_params: any,
			cb: Function
		) {
			cb(null, {
				id: '2',
				name: 'Dining',
				amount: 200,
				category_id: null,
				period_start: '2026-04-01',
				period_end: '2026-04-30',
				created_at: '',
				updated_at: '',
			});
		});
		const result = await repo.getById('2');
		expect(result?.id).toBe('2');
	});

	it('getById returns null when not found', async () => {
		const result = await repo.getById('99');
		expect(result).toBeNull();
	});

	it('create inserts and returns budget', async () => {
		const result = await repo.create({
			name: 'Transport',
			amount: 150,
			categoryId: null,
			periodStart: '2026-05-01',
			periodEnd: '2026-05-31',
		});
		expect(result.name).toBe('Transport');
		expect(result.amount).toBe(150);
	});

	it('update updates and returns budget', async () => {
		db.get.mockImplementationOnce(function (
			this: any,
			_sql: string,
			_params: any,
			cb: Function
		) {
			cb(null, {
				id: '4',
				name: 'Entertainment',
				amount: 100,
				category_id: null,
				period_start: '2026-04-01',
				period_end: '2026-04-30',
				created_at: '',
				updated_at: '',
			});
		});
		const result = await repo.update('4', { amount: 250 });
		expect(result.amount).toBe(250);
	});

	it('update rejects when budget not found', async () => {
		await expect(repo.update('99', { amount: 0 })).rejects.toThrow(
			'Budget not found'
		);
	});

	it('delete removes budget', async () => {
		await expect(repo.delete('5')).resolves.toBeUndefined();
		expect(db.run).toHaveBeenCalled();
	});

	it('clear removes all budgets', async () => {
		await expect(repo.clear()).resolves.toBeUndefined();
		expect(db.run).toHaveBeenCalledWith(
			'DELETE FROM budgets',
			expect.any(Function)
		);
	});
});
