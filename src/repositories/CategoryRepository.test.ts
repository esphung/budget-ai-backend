/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { CategoriesRepository } from './CategoryRepository';

describe('CategoriesRepository', () => {
	let db: any;
	let repo: CategoriesRepository;

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
		repo = new CategoriesRepository(db as any);
	});

	it('getAll returns categories', async () => {
		db.all.mockImplementation(function (
			this: any,
			_sql: string,
			cb: Function
		) {
			cb(null, [
				{
					id: '1',
					name: 'Groceries',
					color: '#ff0000',
					icon: '🛒',
					created_at: '',
					updated_at: '',
				},
			]);
		});
		const result = await repo.getAll();
		expect(result[0].id).toBe('1');
		expect(result[0].name).toBe('Groceries');
	});

	it('getById returns category', async () => {
		db.get.mockImplementation(function (
			this: any,
			_sql: string,
			_params: any,
			cb: Function
		) {
			cb(null, {
				id: '2',
				name: 'Dining',
				color: null,
				icon: null,
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

	it('create inserts and returns category', async () => {
		const result = await repo.create({
			name: 'Transport',
			color: '#0000ff',
			icon: '🚗',
		});
		expect(result.name).toBe('Transport');
	});

	it('update updates and returns category', async () => {
		db.get.mockImplementationOnce(function (
			this: any,
			_sql: string,
			_params: any,
			cb: Function
		) {
			cb(null, {
				id: '4',
				name: 'Entertainment',
				color: null,
				icon: null,
				created_at: '',
				updated_at: '',
			});
		});
		const result = await repo.update('4', { name: 'Fun' });
		expect(result.name).toBe('Fun');
	});

	it('update rejects when category not found', async () => {
		await expect(repo.update('99', { name: 'X' })).rejects.toThrow(
			'Category not found'
		);
	});

	it('delete removes category', async () => {
		await expect(repo.delete('5')).resolves.toBeUndefined();
		expect(db.run).toHaveBeenCalled();
	});

	it('clear removes all categories', async () => {
		await expect(repo.clear()).resolves.toBeUndefined();
		expect(db.run).toHaveBeenCalledWith(
			'DELETE FROM categories',
			expect.any(Function)
		);
	});
});
