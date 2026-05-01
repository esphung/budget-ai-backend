import { Router } from 'express';
import { Database } from 'sqlite3';
import express from 'express';

export class BaseRouter {
	protected router: Router;
	constructor(protected db: Database) {
		this.router = Router();
	}

	// Common methods for all routers can be added here
	get: (
		path: string,
		handler: (req: express.Request, res: express.Response) => void
	) => void = (path, handler) => {
		this.router.get(path, handler);
	};

	post: (
		path: string,
		handler: (req: express.Request, res: express.Response) => void
	) => void = (path, handler) => {
		this.router.post(path, handler);
	};

	put: (
		path: string,
		handler: (req: express.Request, res: express.Response) => void
	) => void = (path, handler) => {
		this.router.put(path, handler);
	};

	delete: (
		path: string,
		handler: (req: express.Request, res: express.Response) => void
	) => void = (path, handler) => {
		this.router.delete(path, handler);
	};

	getRouter() {
		return this.router;
	}
}
