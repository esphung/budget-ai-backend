import { CategoriesController } from './CategoriesController';
import { CategoriesRepository } from '../repositories/CategoryRepository';
import { Database } from 'sqlite3';

jest.mock('../repositories/CategoryRepository');

const MockRepo = CategoriesRepository as jest.MockedClass<
	typeof CategoriesRepository
>;

describe('CategoriesController', () => {
	let controller: CategoriesController;
	let db: Database;
	let repo: jest.Mocked<CategoriesRepository>;

	beforeEach(() => {
		db = {} as Database;
		repo = new MockRepo(db) as jest.Mocked<CategoriesRepository>;
		(CategoriesRepository as jest.Mock).mockReturnValue(repo);
		controller = new CategoriesController(db);
	});

	it('should get all categories', async () => {
		repo.getAll.mockResolvedValueOnce([{ id: '1' } as any]);
		const result = await controller.getAllCategories();
		expect(result).toEqual([{ id: '1' }]);
	});

	it('should create a category', async () => {
		repo.create.mockResolvedValueOnce({ id: '2' } as any);
		const data = { name: 'Groceries' } as any;
		const result = await controller.createCategory(data);
		expect(result).toEqual({ id: '2' });
		expect(repo.create).toHaveBeenCalledWith(data);
	});

	it('should update a category', async () => {
		repo.update.mockResolvedValueOnce({ id: '3' } as any);
		const result = await controller.updateCategory('3', { name: 'Food' });
		expect(result).toEqual({ id: '3' });
		expect(repo.update).toHaveBeenCalledWith('3', { name: 'Food' });
	});

	it('should delete a category', async () => {
		repo.delete.mockResolvedValueOnce();
		await controller.deleteCategory('4');
		expect(repo.delete).toHaveBeenCalledWith('4');
	});

	it('should clear categories', async () => {
		repo.clear.mockResolvedValueOnce();
		await controller.clearCategories();
		expect(repo.clear).toHaveBeenCalled();
	});
});
