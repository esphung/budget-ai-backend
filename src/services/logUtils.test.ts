import express, { Application } from 'express';
import request from 'supertest';
import { logUtils } from './logUtils';

describe('logUtils', () => {
	let app: Application;

	beforeEach(() => {
		app = express();
		jest.clearAllMocks();
		app.use(logUtils.morganMiddleware);
		app.get('/health', (_req, res) => res.status(200).json({ ok: true }));
		app.get('/users', (_req, res) => res.status(200).json({ ok: true }));
	});

	it('exposes logger methods without throwing', () => {
		expect(() => logUtils.logger.info('info message')).not.toThrow();
		expect(() => logUtils.logger.error('error message')).not.toThrow();
		expect(() => logUtils.logger.debug('debug message')).not.toThrow();
		expect(() => logUtils.logger.warn('warn message')).not.toThrow();
		expect(() => logUtils.logger.http('http message')).not.toThrow();
	});

	it('skips request logging for /health', async () => {
		const httpSpy = jest
			.spyOn(logUtils.logger, 'http')
			.mockImplementation(() => undefined);

		await request(app).get('/health').expect(200);

		expect(httpSpy).not.toHaveBeenCalled();
	});

	it('logs non-health requests through the http logger', async () => {
		const httpSpy = jest
			.spyOn(logUtils.logger, 'http')
			.mockImplementation(() => undefined);

		await request(app).get('/users').expect(200);

		expect(httpSpy).toHaveBeenCalledTimes(1);
		expect(httpSpy.mock.calls[0][0]).toContain('GET /users');
	});

	it('trims the trailing newline before forwarding morgan logs', async () => {
		const httpSpy = jest
			.spyOn(logUtils.logger, 'http')
			.mockImplementation(() => undefined);

		await request(app).get('/users').expect(200);

		expect(httpSpy).toHaveBeenCalled();
		expect(httpSpy.mock.calls[0][0].endsWith('\n')).toBe(false);
	});
});
