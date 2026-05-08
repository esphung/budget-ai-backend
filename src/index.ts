import cors from 'cors';
import express, { Request, Response, Router } from 'express';
import { jsonErrorHandler } from './middleware/jsonErrorHandler';
import { parseAuthHeader } from './middleware/parseAuthHeader';
import { openAiRouter, plaidRouter, publicRouter } from './routes';
import { env } from './services/env';
import { logUtils } from './services/logUtils';
import { initDb } from './services/databaseService';
import { Database } from 'sqlite3';
import { createTransactionsRouter } from './routes/transactionsRouter';
import { createAccountsRouter } from './routes/accountsRouter';
import { createCategoriesRouter } from './routes/categoriesRouter';
import { createBudgetsRouter } from './routes/budgetsRouter';

async function startDb(): Promise<Database> {
	try {
		const db = await initDb();
		logUtils.logger.info('Database initialized successfully:', db);
		return db;
	} catch (err) {
		console.error('Failed to initialize database:', err);
		process.exit(1);
	}
}

function generateRouters(db: Database): Record<string, Router> {
	// create routers with db dependency
	const transactions = createTransactionsRouter(db);
	const accounts = createAccountsRouter(db);
	const categories = createCategoriesRouter(db);
	const budgets = createBudgetsRouter(db);

	return { transactions, accounts, categories, budgets };
}

function startServer(routers: Record<string, Router>): express.Application {
	const app = express();
	const PORT = env.port;

	// Middleware
	app.use(
		cors({
			origin: [
				'https://budget-ai-backend-f2124bc32a19.herokuapp.com',
				'https://budget-ai-backend.onrender.com',
			],
		})
	);
	app.use(express.json());
	app.use(parseAuthHeader);
	app.use(logUtils.morganMiddleware);
	app.use(jsonErrorHandler);

	// register routers with db dependency
	app.get('/health', (_req: Request, res: Response) => {
		res.json({ status: 'ok' });
	});
	app.use('/', publicRouter);
	app.use('/plaid', plaidRouter);
	app.use('/openai', openAiRouter);
	app.use('/transactions', routers.transactions);
	app.use('/accounts', routers.accounts);
	app.use('/categories', routers.categories);
	app.use('/budgets', routers.budgets);

	app.listen(Number(PORT), () => {
		logUtils.logger.info(
			`BudgetAI server running on http://localhost:${PORT}`
		);
	});

	return app;
}

async function main() {
	try {
		// initialize database and controllers
		const db = await startDb();

		// create routers with db dependency
		const routers = generateRouters(db);

		// serve API
		startServer(routers);
	} catch (err) {
		console.error('Error starting server:', err);
		process.exit(1);
	}
}

main();
