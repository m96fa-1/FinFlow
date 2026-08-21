import { Router, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'
import { $Enums } from '@prisma/client';

const router = Router();

// Apply JWT middleware to all budget routes
router.use(authenticateToken);

// ==========================================
// 1. GET /api/budgets
// Fetch all budgets for the logged-in user
// Computes spentAmount by summing matching EXPENSE transactions
// ==========================================
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { month, year } = req.query;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const targetDate = new Date();
		const selectedMonth = month ? parseInt(String(month), 10) : targetDate.getMonth() + 1;
		const selectedYear = year ? parseInt(String(year), 10) : targetDate.getFullYear();

		const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
		const endOfMonth = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);

		const budgets = await prisma.budget.findMany({
			where: {
				userId: req.userId,
				month: selectedMonth,
				year: selectedYear,
			},
			include: {
				category: true,
			},
		});

		const expenseAggregates = await prisma.transaction.groupBy({
			by: ['categoryId'],
			_sum: { amount: true },
			where: {
				userId: req.userId,
				type: 'EXPENSE',
				date: { gte: startOfMonth, lte: endOfMonth },
				categoryId: { in: budgets.map(b => b.categoryId) },
			},
		});

		const spentMap = new Map(
			expenseAggregates.map(item => [item.categoryId, item._sum.amount ?? 0])
		);

		const budgetsWithSpent = budgets.map((budget) => {
			const spentAmount = spentMap.get(budget.categoryId) ?? 0;
			return {
				...budget,
				spentAmount,
				remainingAmount: budget.limitAmount - spentAmount,
				isOverBudget: spentAmount > budget.limitAmount,
			};
		});

		return res.json({
			success: true,
			period: { month: selectedMonth, year: selectedYear },
			count: budgetsWithSpent.length,
			data: budgetsWithSpent,
		});
	} catch (error) {
		console.error('Error fetching budgets: ', error);
		return res.status(500).json({ success: false, message: 'Failed to fetch budgets' });
	}
});

// ==========================================
// 2. GET /api/budgets/:id
// Fetch a single budget by ID
// ==========================================
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { id } = req.params;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const budget = await prisma.budget.findFirst({
			where: {
				id: String(id),
				userId: req.userId,
			},
			include: {
				category: true,
			}
		});

		if (!budget) {
			return res.status(404).json({ success: false, message: 'Budget not found' });
		}

		return res.json({ success: true, data: budget });
	} catch (error) {
		console.error('Error fetching budget: ', error);
		return res.status(500).json({ success: false, message: 'Failed to fetch budget' });
	}
});

// ==========================================
// 3. POST /api/budgets
// Create or update a budget limit for a category
// ==========================================
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { categoryId, limitAmount, period, month, year } = req.body;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		if (!categoryId || limitAmount === undefined || month === undefined || year === undefined) {
			return res.status(400).json({
				success: false,
				message: 'categoryId, limitAmount, month, and year are required fields',
			});
		}

		const existingCategory = await prisma.category.findFirst({
			where: {
				id: String(categoryId),
				userId: req.userId,
			},
		});

		if (!existingCategory) {
			return res.status(400).json({ success: false, message: 'Invalid categoryId provided' });
		}

		const parsedMonth = parseInt(String(month), 10);
		const parsedYear = parseInt(String(year), 10);
		const parsedLimit = parseFloat(String(limitAmount));

		const budget = await prisma.budget.upsert({
			where: {
				userId_categoryId_month_year: {
					userId: req.userId,
					categoryId: String(categoryId),
					month: parsedMonth,
					year: parsedYear,
				},
			},
			update: {
				limitAmount: parsedLimit,
				period: period ? period as $Enums.BudgetPeriod : undefined,
			},
			create: {
				userId: req.userId,
				categoryId: String(categoryId),
				limitAmount: parsedLimit,
				period: period ? period as $Enums.BudgetPeriod : 'MONTHLY',
				month: parsedMonth,
				year: parsedYear,
			},
			include: {
				category: true,
			},
		});

		return res.status(200).json({
			success: true,
			message: 'Budget saved successfully',
			data: budget,
		});
	} catch (error) {
		console.error('Error saving budget: ', error);
		return res.status(500).json({ success: false, message: 'Failed to save budget' });
	}
});

// ==========================================
// 4. PUT /api/budgets/:id
// Update an existing budget limit
// ==========================================
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { id } = req.params;
		const { limitAmount, period } = req.body;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const existingBudget = await prisma.budget.findFirst({
			where: {
				id: String(id),
				userId: req.userId
			},
		});

		if (!existingBudget) {
			return res.status(404).json({ success: false, message: 'Budget not found or unauthorized' });
		}

		const updatedBudget = await prisma.budget.update({
			where: {
				id: String(id),
			},
			data: {
				limitAmount: limitAmount !== undefined ? parseFloat(String(limitAmount)) : undefined,
				period: period ? period as $Enums.BudgetPeriod : undefined,
			},
			include: {
				category: true,
			},
		});

		return res.json({
			success: true,
			message: 'Budget updated successfully',
			data: updatedBudget,
		});
	} catch (error) {
		console.error('Error updating budget: ', error);
		return res.status(500).json({ success: false, message: 'Failed to update budget' });
	}
});

// ==========================================
// 5. DELETE /api/budgets/:id
// Delete a budget
// ==========================================
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { id } = req.params;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const existingBudget = await prisma.budget.findFirst({
			where: { id: String(id), userId: req.userId },
		});

		if (!existingBudget) {
			return res.status(404).json({ success: false, message: 'Budget not found or unauthorized' });
		}

		await prisma.budget.delete({
			where: { id: String(id) },
		});

		return res.json({
			success: true,
			message: 'Budget deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting budget: ', error);
		return res.status(500).json({ success: false, message: 'Failed to delete budget' });
	}
});

export default router;