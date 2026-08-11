import { Router, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'

const router = Router();

// Apply JWT middleware to protect all transaction routes
router.use(authenticateToken);

// ==========================================
// 1. GET /api/transactions
// Fetch all transactions for the logged-in user
// Supports optional filters: ?category=Groceries&limit=10
// ==========================================
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { category, limit } = req.query;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const whereCondition: any = {
			userId: req.userId,
		};

		if (category) {
			whereCondition.category = String(category);
		}

		const transactions = await prisma.transaction.findMany({
			where: whereCondition,
			orderBy: {
				date: 'desc',
			},
			take: limit ? parseInt(String(limit), 10) : undefined,
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
		const { amount, category, description, date } = req.body;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		if (amount === undefined || !category) {
			return res.status(400).json({
				success: false,
				message: 'amount and category are required fields',
			});
		}

		const newTransaction = await prisma.transaction.create({
			data: {
				userId: req.userId,
				amount: parseFloat(amount),
				category: String(category),
				description: description || '',
				date: date ? new Date(date) : new Date(),
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
		const { amount, category, description, date } = req.body;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const existingTransaction = await prisma.transaction.findFirst({
			where: {
				id: String(id),
			},
		});

		if (!existingTransaction) {
			return res.status(404).json({ success: false, message: 'Transaction not found or unauthorized' });
		}

		if (existingTransaction.userId !== req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const updatedTransaction = await prisma.transaction.update({
			where: { id: String(id) },
			data: {
				amount: amount !== undefined ? parseFloat(amount) : undefined,
				category: category || undefined,
				description: description !== undefined ? description : undefined,
				date: date ? new Date(date) : undefined,
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
			},
		});

		if (!existingTransaction) {
			return res.status(404).json({ success: false, message: 'Transaction not found or unauthorized' });
		}

		if (existingTransaction.userId !== req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
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