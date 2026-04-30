import cors from 'cors';
import express, { Request, Response } from 'express';
import { jsonErrorHandler } from './middleware/jsonErrorHandler';
import { openAiRouter, plaidRouter, publicRouter } from './routes';
import { env } from './services/env';
import { logUtils } from './services/logUtils';
import { initDb } from './services/databaseService';
import { Database } from 'sqlite3';
import { createTransactionsRouter } from './routes/transactionsRouter';

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

function generateRouters(db: Database) {
	// create routers with db dependency
	const transactions = createTransactionsRouter(db);

	return { transactions };
}

function startServer(db: Database) {
	const app = express();
	const PORT = env.port;

	// Middleware
	app.use(cors({ origin: '*' }));
	app.use(express.json());
	app.use(logUtils.morganMiddleware);
	app.use(jsonErrorHandler);

	// create routers with db dependency
	const routers = generateRouters(db);

	// register routers with db dependency
	app.get('/health', (_req: Request, res: Response) => {
		res.json({ status: 'ok' });
	});
	app.use('/', publicRouter);
	app.use('/plaid', plaidRouter);
	app.use('/openai', openAiRouter);
	app.use('/transactions', (req, res, next) => {
		routers.transactions(req, res, next);
	});

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

		// serve API
		startServer(db);
	} catch (err) {
		console.error('Error starting server:', err);
		process.exit(1);
	}
}

main();
