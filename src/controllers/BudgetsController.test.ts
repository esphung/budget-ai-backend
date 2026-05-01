import { BudgetsController } from './BudgetsController';
import { BudgetsRepository } from '../repositories/BudgetRepository';
import { Database } from 'sqlite3';

jest.mock('../repositories/BudgetRepository');

const MockRepo = BudgetsRepository as jest.MockedClass<
	typeof BudgetsRepository
>;

describe('BudgetsController', () => {
	let controller: BudgetsController;
	let db: Database;
	let repo: jest.Mocked<BudgetsRepository>;

	beforeEach(() => {
		db = {} as Database;
		repo = new MockRepo(db) as jest.Mocked<BudgetsRepository>;
		(BudgetsRepository as jest.Mock).mockReturnValue(repo);
		controller = new BudgetsController(db);
	});

	it('should get all budgets', async () => {
		repo.getAll.mockResolvedValueOnce([{ id: '1' } as any]);
		const result = await controller.getAllBudgets();
		expect(result).toEqual([{ id: '1' }]);
	});

	it('should create a budget', async () => {
		repo.create.mockResolvedValueOnce({ id: '2' } as any);
		const data = { name: 'Monthly', amount: 500 } as any;
		const result = await controller.createBudget(data);
		expect(result).toEqual({ id: '2' });
		expect(repo.create).toHaveBeenCalledWith(data);
	});

	it('should update a budget', async () => {
		repo.update.mockResolvedValueOnce({ id: '3' } as any);
		const result = await controller.updateBudget('3', { amount: 600 });
		expect(result).toEqual({ id: '3' });
		expect(repo.update).toHaveBeenCalledWith('3', { amount: 600 });
	});

	it('should delete a budget', async () => {
		repo.delete.mockResolvedValueOnce();
		await controller.deleteBudget('4');
		expect(repo.delete).toHaveBeenCalledWith('4');
	});

	it('should clear budgets', async () => {
		repo.clear.mockResolvedValueOnce();
		await controller.clearBudgets();
		expect(repo.clear).toHaveBeenCalled();
	});
});
