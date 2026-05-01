import { Database } from 'sqlite3';
import { BudgetsController } from '../controllers/BudgetsController';
import { ErrorTools } from '../utils/ErrorTools';
import { BaseRouter } from './BaseRouter';

class BudgetsRouter extends BaseRouter {
	constructor(db: Database) {
		super(db);
		this.initializeRoutes(new BudgetsController(db));
	}

	private initializeRoutes(controller: BudgetsController) {
		this.get('/', async (_req, res) => {
			try {
				const budgets = await controller.getAllBudgets();
				res.status(200).json(budgets);
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error('[BudgetsRouter] Error fetching budgets:', msg);
				res.status(500).json({ error: msg });
			}
		});

		this.post('/', async (req, res) => {
			try {
				await controller.createBudget(req.body);
				res.status(201).json({
					message: 'Budget created successfully',
				});
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error('[BudgetsRouter] Error creating budget:', msg);
				res.status(400).json({ error: msg });
			}
		});

		this.put('/:id', async (req, res) => {
			try {
				await controller.updateBudget(req.params.id, req.body);
				res.json({ message: 'Budget updated successfully' });
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error('[BudgetsRouter] Error updating budget:', msg);
				res.status(400).json({ error: msg });
			}
		});

		this.delete('/all', async (_req, res) => {
			try {
				await controller.clearBudgets();
				res.json({ message: 'All budgets cleared successfully' });
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error('[BudgetsRouter] Error clearing budgets:', msg);
				res.status(400).json({ error: msg });
			}
		});

		this.delete('/:id', async (req, res) => {
			try {
				await controller.deleteBudget(req.params.id);
				res.json({ message: 'Budget deleted successfully' });
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error('[BudgetsRouter] Error deleting budget:', msg);
				res.status(400).json({ error: msg });
			}
		});
	}
}

export function createBudgetsRouter(db: Database) {
	return new BudgetsRouter(db).getRouter();
}
