import { Database } from 'sqlite3';
import { AccountsController } from '../controllers/AccountsController';
import { ErrorTools } from '../utils/ErrorTools';
import { BaseRouter } from './BaseRouter';

class AccountsRouter extends BaseRouter {
	constructor(db: Database) {
		super(db);
		this.initializeRoutes(new AccountsController(db));
	}

	private initializeRoutes(controller: AccountsController) {
		this.get('/', async (_req, res) => {
			try {
				const accounts = await controller.getAllAccounts();
				res.status(200).json(accounts);
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error('[AccountsRouter] Error fetching accounts:', msg);
				res.status(500).json({
					error: ErrorTools.extractErrorMessage(error),
				});
			}
		});

		this.post('/', async (req, res) => {
			const accountData = req.body;
			try {
				await controller.createAccount(accountData);
				res.status(201).json({
					message: 'Account created successfully',
				});
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error('[AccountsRouter] Error creating account:', msg);
				res.status(400).json({ error: msg });
			}
		});

		this.put('/:id', async (req, res) => {
			const accountId = req.params.id;
			const accountData = req.body;
			try {
				await controller.updateAccount(accountId, accountData);
				res.json({ message: 'Account updated successfully' });
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error('[AccountsRouter] Error updating account:', msg);
				res.status(400).json({ error: msg });
			}
		});

		this.delete('/all', async (_req, res) => {
			try {
				await controller.clearAccounts();
				res.json({ message: 'All accounts cleared successfully' });
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error('[AccountsRouter] Error clearing accounts:', msg);
				res.status(400).json({ error: msg });
			}
		});

		this.delete('/:id', async (req, res) => {
			const accountId = req.params.id;
			try {
				await controller.deleteAccount(accountId);
				res.json({ message: 'Account deleted successfully' });
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error('[AccountsRouter] Error deleting account:', msg);
				res.status(400).json({ error: msg });
			}
		});
	}
}

export function createAccountsRouter(db: Database) {
	const accountsRouter = new AccountsRouter(db);
	return accountsRouter.getRouter();
}
