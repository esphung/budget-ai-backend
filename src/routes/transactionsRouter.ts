import { Router } from 'express';
import { TransactionsController } from '../controllers/transactions_controller';
import { Database } from 'sqlite3';

const transactionsRouter = Router();

function createTransactionsRouter(db: Database) {
	const transactionsController = new TransactionsController(db);

	// Get all transactions
	transactionsRouter.get('/', (req, res) => {
		const transactions = transactionsController.getAllTransactions();
		res.json(transactions);
	});

	// Create a new transaction
	transactionsRouter.post('/', (req, res) => {
		const transactionData = req.body;
		try {
			transactionsController.createTransaction(transactionData);
			res.status(201).json({
				message: 'Transaction created successfully',
			});
		} catch (error: any | Error) {
			res.status(400).json({ error: error.message });
		}
	});

	// Update a transaction
	transactionsRouter.put('/:id', (req, res) => {
		const transactionId = req.params.id;
		const transactionData = req.body;
		try {
			transactionsController.updateTransaction(
				transactionId,
				transactionData
			);
			res.json({ message: 'Transaction updated successfully' });
		} catch (error: any | Error) {
			res.status(400).json({ error: error.message });
		}
	});

	// Delete a transaction
	transactionsRouter.delete('/:id', (req, res) => {
		const transactionId = req.params.id;
		try {
			transactionsController.deleteTransaction(transactionId);
			res.json({ message: 'Transaction deleted successfully' });
		} catch (error: any | Error) {
			res.status(400).json({ error: error.message });
		}
	});

	return transactionsRouter;
}

export { createTransactionsRouter };
