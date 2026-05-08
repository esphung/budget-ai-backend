import { Database } from 'sqlite3';
import { TransactionsController } from '../controllers/TransactionsController';
import { ErrorTools } from '../utils/ErrorTools';
import { BaseRouter } from './BaseRouter';

class TransactionsRouter extends BaseRouter {
	constructor(db: Database) {
		super(db);
		this.initializeRoutes(new TransactionsController(db));
	}

	private initializeRoutes(controller: TransactionsController) {
		this.get('/', async (req, res) => {
			try {
				const transactions = await controller.getAllTransactions(
					req.ownerId
				);
				res.status(200).json(transactions);
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error(
					'[TransactionsRouter] Error fetching transactions:',
					msg
				);
				res.status(500).json({
					error: ErrorTools.extractErrorMessage(error),
				});
			}
		});

		this.post('/', async (req, res) => {
			const transactionData = req.body;
			try {
				await controller.createTransaction(
					transactionData,
					req.ownerId
				);
				res.status(201).json({
					message: 'Transaction created successfully',
				});
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error(
					'[TransactionsRouter] Error creating transaction:',
					msg
				);
				res.status(400).json({ error: msg });
			}
		});

		this.put('/:id', async (req, res) => {
			const transactionId = req.params.id;
			const transactionData = req.body;
			try {
				await controller.updateTransaction(
					transactionId,
					transactionData,
					req.ownerId
				);
				res.json({ message: 'Transaction updated successfully' });
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error(
					'[TransactionsRouter] Error updating transaction:',
					msg
				);
				res.status(400).json({ error: msg });
			}
		});

		this.delete('/all', async (req, res) => {
			try {
				await controller.clearTransactions(req.ownerId);
				res.json({ message: 'All transactions cleared successfully' });
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error(
					'[TransactionsRouter] Error clearing transactions:',
					msg
				);
				res.status(400).json({ error: msg });
			}
		});

		this.delete('/:id', async (req, res) => {
			const transactionId = req.params.id;
			try {
				await controller.deleteTransaction(transactionId, req.ownerId);
				res.json({ message: 'Transaction deleted successfully' });
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error(
					'[TransactionsRouter] Error deleting transaction:',
					msg
				);
				res.status(400).json({ error: msg });
			}
		});
	}
}

export function createTransactionsRouter(db: Database) {
	const transactionsRouter = new TransactionsRouter(db);
	return transactionsRouter.getRouter();
}
