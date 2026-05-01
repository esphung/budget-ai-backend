import express from 'express';
import request from 'supertest';
import { createCategoriesRouter } from './categoriesRouter';
import { Database } from 'sqlite3';

jest.mock('../controllers/CategoriesController');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockController = require('../controllers/CategoriesController');

const mockDb = {} as Database;

const mockMethods = {
	getAllCategories: jest.fn().mockResolvedValue([{ id: '1' }]),
	createCategory: jest.fn().mockResolvedValue({ id: '2' }),
	updateCategory: jest.fn().mockResolvedValue({ id: '3' }),
	clearCategories: jest.fn().mockResolvedValue(undefined),
	deleteCategory: jest.fn().mockResolvedValue(undefined),
};

mockController.CategoriesController.mockImplementation(() => mockMethods);

describe('categoriesRouter', () => {
	let app: express.Application;

	beforeEach(() => {
		app = express();
		app.use(express.json());
		app.use('/categories', createCategoriesRouter(mockDb));
		jest.clearAllMocks();
	});

	it('GET /categories returns categories', async () => {
		const res = await request(app).get('/categories');
		expect(res.status).toBe(200);
		expect(res.body).toEqual([{ id: '1' }]);
	});

	it('POST /categories creates a category', async () => {
		const res = await request(app)
			.post('/categories')
			.send({ name: 'Groceries' });
		expect(res.status).toBe(201);
		expect(res.body.message).toMatch(/created/i);
	});

	it('PUT /categories/:id updates a category', async () => {
		const res = await request(app)
			.put('/categories/3')
			.send({ name: 'Food' });
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/updated/i);
	});

	it('DELETE /categories/all clears all categories', async () => {
		const res = await request(app).delete('/categories/all');
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/cleared/i);
	});

	it('DELETE /categories/:id deletes a category', async () => {
		const res = await request(app).delete('/categories/4');
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/deleted/i);
	});
});
