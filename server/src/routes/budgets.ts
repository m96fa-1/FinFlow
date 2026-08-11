import { Router, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'

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

		const targetDate = new Date();
		const selectedMonth = month ? parseInt(String(month), 10) : targetDate.getMonth() + 1;
		const selectedYear = year ? parseInt(String(year), 10) : targetDate.getFullYear();

		const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
		const endOfMonth = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);

		// Fetch user budgets
		const budgets = await prisma.budget.findMany({
			where: {
				userId: req.userId,
			},
		});

		// Calculate progress/spent amount for each budget
		const budgetsWithSpent = await Promise.all(
			budgets.map(async (budget) => {
				const result = await prisma.transaction.aggregate({
					_sum: {
						amount: true,
					},
					where: {
						userId: req.userId,
						type: 'EXPENSE',
						date: {
							gte: startOfMonth,
							lte: endOfMonth,
						},
						category: budget.category,
					},
				});

				const spentAmount = result._sum?.amount ?? 0;

				return {
					...budget,
					spentAmount,
					remainingAmount: budget.limitAmount - spentAmount,
					isOverBudget: spentAmount > budget.limitAmount,
				};
			})
		);

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

		const budget = await prisma.budget.findFirst({
			where: {
				id: String(id),
				userId: req.userId,
			},
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
		const { category, limitAmount, period } = req.body;

		if (!category || limitAmount === undefined) {
			return res.status(400).json({
				success: false,
				message: 'category and limitAmount are required fields',
			});
		}

		// Check if user already has a budget set for this category name
		const existingBudget = await prisma.budget.findFirst({
			where: {
				userId: req.userId,
				category,
			},
		});

		let budget;

		if (existingBudget) {
			// Update existing budget
			budget = await prisma.budget.update({
				where: { id: existingBudget.id },
				data: {
					limitAmount: parseFloat(limitAmount),
					period: period || existingBudget.period,
				},
			});
		} else {
			// Create a new budget
			budget = await prisma.budget.create({
				data: {
					category,
					limitAmount: parseFloat(limitAmount),
					period: period || 'monthly',
					userId: req.userId!,
				},
			});
		}

		return res.status(201).json({
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
		const { category, limitAmount, period } = req.body;

		const existingBudget = await prisma.budget.findFirst({
			where: { id: String(id), userId: req.userId },
		});

		if (!existingBudget) {
			return res.status(404).json({ success: false, message: 'Budget not found or unauthorized' });
		}

		const updatedBudget = await prisma.budget.update({
			where: { id: String(id) },
			data: {
				category: category || undefined,
				limitAmount: limitAmount !== undefined ? parseFloat(limitAmount) : undefined,
				period: period || undefined,
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