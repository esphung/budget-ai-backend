import morgan from 'morgan';
import { Logger } from 'tslog';
import express from 'express';

const log = new Logger({ name: 'budget-ai-backend' });

function createLogger(moduleName: string) {
	return {
		info: (message: string, meta?: any) => {
			log.info(`[${moduleName}] ${message}`, meta);
		},
		error: (message: string, meta?: any) => {
			log.error(`[${moduleName}] ${message}`, meta);
		},
		debug: (message: string, meta?: any) => {
			log.debug(`[${moduleName}] ${message}`, meta);
		},
		warn: (message: string, meta?: any) => {
			log.warn(`[${moduleName}] ${message}`, meta);
		},
		http: (message: string, meta?: any) => {
			log.debug(`[${moduleName}] ${message}`, meta);
		},
	};
}

export const logUtils = {
	logger: createLogger('budget-ai-backend'),
	morganMiddleware: morgan('combined', {
		stream: {
			write: (message: string) => logUtils.logger.http(message.trim()),
		},
		skip: (req: express.Request, _res: express.Response) =>
			req.url === '/health',
	}),
};
