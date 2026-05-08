import { Request, Response, NextFunction } from 'express';

export function parseAuthHeader(
	req: Request,
	_res: Response,
	next: NextFunction
): void {
	const authHeader = req.headers['authorization'];
	if (authHeader && authHeader.startsWith('Bearer ')) {
		const token = authHeader.slice(7);
		try {
			const payload = JSON.parse(
				Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
			);
			req.ownerId = payload.sub;
			console.debug(`OWNER ID: ${req.ownerId}`);
		} catch {
			// malformed token — ownerId stays undefined
		}
	}
	next();
}
