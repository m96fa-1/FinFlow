import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
	userId?: string;
}

export const authenticateToken = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer "

	if (!token) {
		return res.status(401).json({ success: false, message: 'Access token missing' });
	}

	const secret = process.env.JWT_SECRET || 'fallback-secret';

	jwt.verify(token, secret, (err, decoded) => {
		if (err) {
			return res.status(403).json({ success: false, message: 'Invalid or expired token' });
		}

		req.userId = (decoded as { userId: string }).userId;
		next();
	});
};