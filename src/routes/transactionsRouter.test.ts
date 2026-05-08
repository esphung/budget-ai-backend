import express from 'express';
import request from 'supertest';
import { createTransactionsRouter } from './transactionsRouter';
import { Database } from 'sqlite3';

jest.mock('../controllers/TransactionsController');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockController = require('../controllers/TransactionsController');

const mockDb = {} as Database;

const mockMethods = {
	getAllTransactions: jest.fn().mockResolvedValue([{ id: '1' }]),
	createTransaction: jest.fn().mockResolvedValue({ id: '2' }),
	updateTransaction: jest.fn().mockResolvedValue({ id: '3' }),
	clearTransactions: jest.fn().mockResolvedValue(undefined),
	deleteTransaction: jest.fn().mockResolvedValue(undefined),
};

mockController.TransactionsController.mockImplementation(() => mockMethods);

describe('transactionsRouter', () => {
	let app: express.Application;

	beforeEach(() => {
		app = express();
		app.use(express.json());
		app.use('/transactions', createTransactionsRouter(mockDb));
		jest.clearAllMocks();
	});

	it('GET /transactions returns transactions', async () => {
		const res = await request(app).get('/transactions');
		expect(res.status).toBe(200);
		expect(res.body).toEqual([{ id: '1' }]);
	});

	it('POST /transactions creates a transaction', async () => {
		const res = await request(app)
			.post('/transactions')
			.send({ amount: 100 });
		expect(res.status).toBe(201);
		expect(res.body.message).toMatch(/created/i);
	});

	it('PUT /transactions/:id updates a transaction', async () => {
		const res = await request(app)
			.put('/transactions/3')
			.send({ amount: 200 });
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/updated/i);
	});

	it('DELETE /transactions/all clears all transactions', async () => {
		const res = await request(app).delete('/transactions/all');
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/cleared/i);
	});

	it('DELETE /transactions/clear clears all transactions', async () => {
		const res = await request(app).delete('/transactions/clear');
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/cleared/i);
	});

	it('DELETE /transactions/:id deletes a transaction', async () => {
		const res = await request(app).delete('/transactions/4');
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/deleted/i);
	});
});
