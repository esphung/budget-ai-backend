import { AccountsController } from './AccountsController';
import { AccountsRepository } from '../repositories/AccountRepository';
import { Database } from 'sqlite3';

jest.mock('../repositories/AccountRepository');

const MockRepo = AccountsRepository as jest.MockedClass<
	typeof AccountsRepository
>;

describe('AccountsController', () => {
	let controller: AccountsController;
	let db: Database;
	let repo: jest.Mocked<AccountsRepository>;

	beforeEach(() => {
		db = {} as Database;
		repo = new MockRepo(db) as jest.Mocked<AccountsRepository>;
		(AccountsRepository as jest.Mock).mockReturnValue(repo);
		controller = new AccountsController(db);
	});

	it('should get all accounts', async () => {
		repo.getAll.mockResolvedValueOnce([{ id: '1' } as any]);
		const result = await controller.getAllAccounts();
		expect(result).toEqual([{ id: '1' }]);
	});

	it('should create an account', async () => {
		repo.create.mockResolvedValueOnce({ id: '2' } as any);
		const data = { name: 'Wallet', accountType: 'cash' } as any;
		const result = await controller.createAccount(data);
		expect(result).toEqual({ id: '2' });
		expect(repo.create).toHaveBeenCalledWith(data);
	});

	it('should update an account', async () => {
		repo.update.mockResolvedValueOnce({ id: '3' } as any);
		const result = await controller.updateAccount('3', {
			name: 'Updated Account',
		});
		expect(result).toEqual({ id: '3' });
		expect(repo.update).toHaveBeenCalledWith('3', {
			name: 'Updated Account',
		});
	});

	it('should delete an account', async () => {
		repo.delete.mockResolvedValueOnce();
		await controller.deleteAccount('4');
		expect(repo.delete).toHaveBeenCalledWith('4');
	});

	it('should clear accounts', async () => {
		repo.clear.mockResolvedValueOnce();
		await controller.clearAccounts();
		expect(repo.clear).toHaveBeenCalled();
	});
});
