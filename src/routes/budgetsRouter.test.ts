import express from 'express';
import request from 'supertest';
import { createBudgetsRouter } from './budgetsRouter';
import { Database } from 'sqlite3';

jest.mock('../controllers/BudgetsController');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockController = require('../controllers/BudgetsController');

const mockDb = {} as Database;

const mockMethods = {
	getAllBudgets: jest.fn().mockResolvedValue([{ id: '1' }]),
	createBudget: jest.fn().mockResolvedValue({ id: '2' }),
	updateBudget: jest.fn().mockResolvedValue({ id: '3' }),
	clearBudgets: jest.fn().mockResolvedValue(undefined),
	deleteBudget: jest.fn().mockResolvedValue(undefined),
};

mockController.BudgetsController.mockImplementation(() => mockMethods);

describe('budgetsRouter', () => {
	let app: express.Application;

	beforeEach(() => {
		app = express();
		app.use(express.json());
		app.use('/budgets', createBudgetsRouter(mockDb));
		jest.clearAllMocks();
	});

	it('GET /budgets returns budgets', async () => {
		const res = await request(app).get('/budgets');
		expect(res.status).toBe(200);
		expect(res.body).toEqual([{ id: '1' }]);
	});

	it('POST /budgets creates a budget', async () => {
		const res = await request(app)
			.post('/budgets')
			.send({ name: 'Monthly', amount: 500 });
		expect(res.status).toBe(201);
		expect(res.body.message).toMatch(/created/i);
	});

	it('PUT /budgets/:id updates a budget', async () => {
		const res = await request(app).put('/budgets/3').send({ amount: 600 });
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/updated/i);
	});

	it('DELETE /budgets/all clears all budgets', async () => {
		const res = await request(app).delete('/budgets/all');
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/cleared/i);
	});

	it('DELETE /budgets/:id deletes a budget', async () => {
		const res = await request(app).delete('/budgets/4');
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/deleted/i);
	});
});
