import { Router, Response } from 'express'
import { prisma } from '../lib/prisma'
import { $Enums } from '@prisma/client'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'

const router = Router();

// Apply JWT middleware to protect all transaction routes
router.use(authenticateToken);

// ==========================================
// 1. GET /api/transactions
// Fetch all transactions for the logged-in user
// Supports optional filters: ?category=Groceries&type=EXPENSE&limit=10
// ==========================================
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { category, type, limit } = req.query;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const whereCondition: any = {
			userId: req.userId,
			type: type ? type as $Enums.TransactionType : undefined,
		};

		if (category) {
			const fetchedCategory = await prisma.category.findFirst({
				where: {
					name: String(category),
					userId: req.userId,
				},
			});
			if (!fetchedCategory) {
				return res.status(404).json({ success: false, message: `Category ${category} was not found` });
			}

			whereCondition.categoryId = fetchedCategory.id;
		}

		const transactions = await prisma.transaction.findMany({
			where: whereCondition,
			orderBy: {
				date: 'desc',
			},
			take: limit ? parseInt(String(limit), 10) : undefined,
			include: {
				category: true,
			},
		});

		return res.json({
			success: true,
			count: transactions.length,
			data: transactions,
		});
	} catch (error) {
		console.error('Error fetching transactions: ', error);
		return res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
	}
});

// ==========================================
// 2. GET /api/transactions/:id
// Fetch a single transaction by ID
// ==========================================
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { id } = req.params;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const transaction = await prisma.transaction.findFirst({
			where: {
				id: String(id),
				userId: req.userId,
			},
			include: {
				category: true,
			},
		});

		if (!transaction) {
			return res.status(404).json({ success: false, message: 'Transaction not found' });
		}

		return res.json({ success: true, data: transaction });
	} catch (error) {
		console.error('Error fetching transaction: ', error);
		return res.status(500).json({ success: false, message: 'Failed to fetch transaction' });
	}
});

// ==========================================
// 3. POST /api/transactions
// Create a new transaction
// ==========================================
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { categoryId, amount, type, date, description } = req.body;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		if (!categoryId || amount === undefined) {
			return res.status(400).json({
				success: false,
				message: 'categoryId and amount are required fields',
			});
		}

		const targetCategory = await prisma.category.findFirst({
			where: {
				id: String(categoryId),
				userId: req.userId,
			},
		});

		if (!targetCategory) {
			return res.status(400).json({ success: false, message: 'Invalid categoryId provided' });
		}

		if (type && String(type) !== 'INCOME' && String(type) !== 'EXPENSE') {
			return res.status(400).json({
				success: false,
				message: 'type must be either \'INCOME\' or \'EXPENSE\'',
			});
		}

		const newTransaction = await prisma.transaction.create({
			data: {
				userId: req.userId,
				categoryId: String(categoryId),
				amount: parseFloat(amount),
				type: type ? type as $Enums.TransactionType : targetCategory.type,
				date: date ? new Date(date) : undefined,
				description: description ? String(description) : undefined,
			},
			include: {
				category: true,
			},
		});

		return res.status(201).json({
			success: true,
			message: 'Transaction created successfully',
			data: newTransaction,
		});
	} catch (error) {
		console.error('Error creating transaction: ', error);
		return res.status(500).json({ success: false, message: 'Failed to create transaction' });
	}
});

// ==========================================
// 4. PUT /api/transactions/:id
// Update an existing transaction
// ==========================================
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { id } = req.params;
		const { categoryId, amount, type, date, description } = req.body;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}
		
		if (categoryId) {
			const targetCategory = await prisma.category.findFirst({
				where: {
					id: String(categoryId),
					userId: req.userId,
				},
			});

			if (!targetCategory) {
				return res.status(400).json({ success: false, message: 'Invalid categoryId' });
			}
		}

		const existingTransaction = await prisma.transaction.findFirst({
			where: {
				id: String(id),
				userId: req.userId,
			},
		});

		if (!existingTransaction) {
			return res.status(404).json({ success: false, message: 'Transaction not found or unauthorized' });
		}

		if (type && String(type) !== 'INCOME' && String(type) !== 'EXPENSE') {
			return res.status(400).json({
				success: false,
				message: 'type must be either \'INCOME\' or \'EXPENSE\'',
			});
		}

		const updatedTransaction = await prisma.transaction.update({
			where: {
				id: String(id),
			},
			data: {
				categoryId: categoryId ? String(categoryId) : undefined,
				amount: amount !== undefined ? parseFloat(amount) : undefined,
				type: type ? type as $Enums.TransactionType : undefined,
				date: date ? new Date(date) : undefined,
				description: description ? String(description) : undefined,
			},
			include: {
				category: true,
			},
		});

		return res.json({
			success: true,
			message: 'Transaction updated successfully',
			data: updatedTransaction,
		});
	} catch (error) {
		console.error('Error updating transaction: ', error);
		return res.status(500).json({ success: false, message: 'Failed to update transaction' });
	}
});

// ==========================================
// 5. DELETE /api/transactions/:id
// Delete a transaction
// ==========================================
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { id } = req.params;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const existingTransaction = await prisma.transaction.findFirst({
			where: {
				id: String(id),
				userId: req.userId,
			},
		});

		if (!existingTransaction) {
			return res.status(404).json({ success: false, message: 'Transaction not found or unauthorized' });
		}

		await prisma.transaction.delete({
			where: { id: String(id) },
		});

		return res.json({
			success: true,
			message: 'Transaction deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting transaction: ', error);
		return res.status(500).json({ success: false, message: 'Failed to delete transaction' });
	}
});

export default router;