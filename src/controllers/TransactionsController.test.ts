import { TransactionsController } from './TransactionsController';
import { TransactionsRepository } from '../repositories/TransactionRepository';
import { Database } from 'sqlite3';

jest.mock('../repositories/TransactionRepository');

const MockRepo = TransactionsRepository as jest.MockedClass<
	typeof TransactionsRepository
>;

describe('TransactionsController', () => {
	let controller: TransactionsController;
	let db: Database;
	let repo: jest.Mocked<TransactionsRepository>;

	beforeEach(() => {
		db = {} as Database;
		repo = new MockRepo(db) as jest.Mocked<TransactionsRepository>;
		(TransactionsRepository as jest.Mock).mockReturnValue(repo);
		controller = new TransactionsController(db);
	});

	it('should get all transactions', async () => {
		repo.getAll.mockResolvedValueOnce([{ id: '1' } as any]);
		const result = await controller.getAllTransactions();
		expect(result).toEqual([{ id: '1' }]);
	});

	it('should create a transaction', async () => {
		repo.create.mockResolvedValueOnce({ id: '2' } as any);
		const data = { amount: 100 } as any;
		const result = await controller.createTransaction(data);
		expect(result).toEqual({ id: '2' });
		expect(repo.create).toHaveBeenCalledWith(data);
	});

	it('should update a transaction', async () => {
		repo.update.mockResolvedValueOnce({ id: '3' } as any);
		const result = await controller.updateTransaction('3', { amount: 200 });
		expect(result).toEqual({ id: '3' });
		expect(repo.update).toHaveBeenCalledWith('3', { amount: 200 });
	});

	it('should delete a transaction', async () => {
		repo.delete.mockResolvedValueOnce();
		await controller.deleteTransaction('4');
		expect(repo.delete).toHaveBeenCalledWith('4');
	});

	it('should clear transactions', async () => {
		repo.clear.mockResolvedValueOnce();
		await controller.clearTransactions();
		expect(repo.clear).toHaveBeenCalled();
	});
});
