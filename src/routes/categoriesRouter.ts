import { Database } from 'sqlite3';
import { CategoriesController } from '../controllers/CategoriesController';
import { ErrorTools } from '../utils/ErrorTools';
import { BaseRouter } from './BaseRouter';

class CategoriesRouter extends BaseRouter {
	constructor(db: Database) {
		super(db);
		this.initializeRoutes(new CategoriesController(db));
	}

	private initializeRoutes(controller: CategoriesController) {
		this.get('/', async (req, res) => {
			try {
				const categories = await controller.getAllCategories(
					req.ownerId
				);
				res.status(200).json(categories);
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error(
					'[CategoriesRouter] Error fetching categories:',
					msg
				);
				res.status(500).json({ error: msg });
			}
		});

		this.post('/', async (req, res) => {
			try {
				await controller.createCategory(req.body, req.ownerId);
				res.status(201).json({
					message: 'Category created successfully',
				});
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error(
					'[CategoriesRouter] Error creating category:',
					msg
				);
				res.status(400).json({ error: msg });
			}
		});

		this.put('/:id', async (req, res) => {
			try {
				await controller.updateCategory(
					req.params.id,
					req.body,
					req.ownerId
				);
				res.json({ message: 'Category updated successfully' });
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error(
					'[CategoriesRouter] Error updating category:',
					msg
				);
				res.status(400).json({ error: msg });
			}
		});

		this.delete('/all', async (req, res) => {
			try {
				await controller.clearCategories(req.ownerId);
				res.json({ message: 'All categories cleared successfully' });
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error(
					'[CategoriesRouter] Error clearing categories:',
					msg
				);
				res.status(400).json({ error: msg });
			}
		});

		this.delete('/:id', async (req, res) => {
			try {
				await controller.deleteCategory(req.params.id, req.ownerId);
				res.json({ message: 'Category deleted successfully' });
			} catch (error: any | Error) {
				const msg = ErrorTools.extractErrorMessage(error);
				console.error(
					'[CategoriesRouter] Error deleting category:',
					msg
				);
				res.status(400).json({ error: msg });
			}
		});
	}
}

export function createCategoriesRouter(db: Database) {
	return new CategoriesRouter(db).getRouter();
}
