import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth'
import { prisma } from '../lib/prisma'

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// ==========================================
// POST Register: /api/auth/register
// ==========================================
router.post('/register', async (req: Request, res: Response) => {
	try {
		const { fullName, email, password } = req.body;

		if (!fullName || !email || !password) {
			return res.status(400).json({
				success: false,
				message: 'fullName, email, and password fields are required',
			});
		}

		const normalizedFullName = String(fullName).trim();
		const normalizedEmail = String(email).toLowerCase().trim();
		const parsedPassword = String(password);

		const existingUser = await prisma.user.findUnique({
			where: { email: normalizedEmail },
		});

		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: 'User with this email already exists',
			});
		}

		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(parsedPassword, saltRounds);

		const user = await prisma.$transaction(async (tx) => {
			const newUser = await tx.user.create({
				data: {
					fullName: normalizedFullName,
					email: normalizedEmail,
					passwordHash,
				},
			});

			const defaultCategories = await tx.category.findMany({
				where: { userId: null },
			});

			if (defaultCategories.length > 0) {
				await tx.category.createMany({
					data: defaultCategories.map((template) => ({
						userId: newUser.id,
						name: template.name,
						icon: template.icon,
						color: template.color,
						type: template.type,
					})),
				});
			}

			return newUser;
		});

		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			JWT_SECRET,
			{ expiresIn: '7d' },
		);

		return res.status(201).json({
			success: true,
			message: 'User registered successfully',
			token,
			user: {
				id: user.id,
				fullName: user.fullName,
				email: user.email,
				createdAt: user.createdAt,
			},
		});
	} catch (error) {
		console.error('Register error: ', error);
		return res.status(500).json({ success: false, message: 'Server error during registration' });
	}
});

// ==========================================
// POST Login: /api/auth/login
// ==========================================
router.post('/login', async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: 'Email and password are required',
			});
		}

		const normalizedEmail = String(email).toLowerCase().trim();
		const parsedPassword = String(password);

		const user = await prisma.user.findUnique({
			where: { email: normalizedEmail },
		});

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password',
			});
		}

		const isPasswordValid = await bcrypt.compare(parsedPassword, user.passwordHash);
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password',
			});
		}

		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			JWT_SECRET,
			{ expiresIn: '7d' },
		);

		return res.json({
			success: true,
			message: 'Logged in successfully',
			token,
			user: {
				id: user.id,
				fullName: user.fullName,
				email: user.email,
				createdAt: user.createdAt,
			},
		});
	} catch (error) {
		console.error('Login error: ', error);
		return res.status(500).json({ success: false, message: 'Server error during login' });
	}
});

// ==========================================
// GET Current User: /api/auth/user
// ==========================================
router.get('/user', authenticateToken, async (req: AuthenticatedRequest, res) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const user = await prisma.user.findUnique({
			where: { id: req.userId },
			select: {
				id: true,
				fullName: true,
				email: true,
				createdAt: true,
			},
		});

		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' });
		}

		return res.json({ success: true, user });
	} catch (error) {
		console.error('User fetch error:', error);
		return res.status(500).json({ success: false, message: 'Server error while fetching user' });
	}
});

export default router;