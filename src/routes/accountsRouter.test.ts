import express from 'express';
import request from 'supertest';
import { createAccountsRouter } from './accountsRouter';
import { Database } from 'sqlite3';

jest.mock('../controllers/AccountsController');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockController = require('../controllers/AccountsController');

const mockDb = {} as Database;

const mockMethods = {
	getAllAccounts: jest.fn().mockResolvedValue([{ id: '1' }]),
	createAccount: jest.fn().mockResolvedValue({ id: '2' }),
	updateAccount: jest.fn().mockResolvedValue({ id: '3' }),
	clearAccounts: jest.fn().mockResolvedValue(undefined),
	deleteAccount: jest.fn().mockResolvedValue(undefined),
};

mockController.AccountsController.mockImplementation(() => mockMethods);

describe('accountsRouter', () => {
	let app: express.Application;

	beforeEach(() => {
		app = express();
		app.use(express.json());
		app.use('/accounts', createAccountsRouter(mockDb));
		jest.clearAllMocks();
	});

	it('GET /accounts returns accounts', async () => {
		const res = await request(app).get('/accounts');
		expect(res.status).toBe(200);
		expect(res.body).toEqual([{ id: '1' }]);
	});

	it('POST /accounts creates an account', async () => {
		const res = await request(app)
			.post('/accounts')
			.send({ name: 'Wallet', accountType: 'cash' });
		expect(res.status).toBe(201);
		expect(res.body.message).toMatch(/created/i);
	});

	it('PUT /accounts/:id updates an account', async () => {
		const res = await request(app)
			.put('/accounts/3')
			.send({ name: 'Updated Account' });
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/updated/i);
	});

	it('DELETE /accounts/all clears all accounts', async () => {
		const res = await request(app).delete('/accounts/all');
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/cleared/i);
	});

	it('DELETE /accounts/:id deletes an account', async () => {
		const res = await request(app).delete('/accounts/4');
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/deleted/i);
	});
});
