import { Router, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'

const router = Router();

// Apply JWT middleware to all budget routes
router.use(authenticateToken);

// ==========================================
// 1. GET /api/categories
// Fetch all categories for the logged-in user
// Supports optional filters: ?type=EXPENSE&limit=10
// ==========================================
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { type, limit } = req.query;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const parsedType = type === 'INCOME' || type === 'EXPENSE' ? type : undefined;

		const categories = await prisma.category.findMany({
			where: {
				userId: req.userId,
				...(parsedType ? { type: parsedType } : {})
			},
			take: limit ? parseInt(String(limit), 10) : undefined,
			select: {
				id: true,
				userId: true,
				name: true,
				icon: true,
				color: true,
				type: true,
				_count: {
					select: { transactions: true, budgets: true },
				},
			},
			orderBy: { name: 'asc' },
		});

		return res.json({
			success: true,
			count: categories.length,
			data: categories,
		});
	} catch (error) {
		console.error('Error fetching categories: ', error);
		return res.status(500).json({ success: false, message: 'Failed to fetch categories' });
	}
});

// ==========================================
// 2. GET /api/categories/:id
// Fetch a single category by ID
// ==========================================
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { id } = req.params;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const category = await prisma.category.findFirst({
			where: {
				id: String(id),
				userId: req.userId,
			},
			select: {
				id: true,
				userId: true,
				name: true,
				icon: true,
				color: true,
				type: true,
				_count: {
					select: { transactions: true, budgets: true },
				},
			},
		});

		if (!category) {
			return res.status(404).json({ success: false, message: 'Category not found' });
		}

		return res.json({ success: true, data: category });
	} catch (error) {
		console.error('Error fetching category: ', error);
		return res.status(500).json({ success: false, message: 'Failed to fetch category' });
	}
});

// ==========================================
// 3. POST /api/categories
// Create a new category
// ==========================================
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { name, icon, color, type } = req.body;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		if (!name) {
			return res.status(400).json({
				success: false,
				message: 'name is a required field',
			});
		}

		if (type && String(type) !== 'INCOME' && String(type) !== 'EXPENSE') {
			return res.status(400).json({
				success: false,
				message: 'type must be either \'INCOME\' or \'EXPENSE\'',
			});
		}

		const newCategory = await prisma.category.create({
			data: {
				userId: req.userId,
				name: String(name).trim(),
				icon: icon ? String(icon) : undefined,
				color: color ? String(color) : undefined,
				type: type ? (type as 'INCOME' | 'EXPENSE') : 'EXPENSE',
			},
			select: {
				id: true,
				userId: true,
				name: true,
				icon: true,
				color: true,
				type: true,
				_count: {
					select: { transactions: true, budgets: true },
				},
			},
		});

		return res.status(201).json({
			success: true,
			message: 'Category created successfully',
			data: newCategory,
		});
	} catch (error: any) {
		if (error.code === 'P2002') {
			return res.status(409).json({ success: false, message: 'A category with this name already exists' });
		}
		console.error('Error creating category: ', error);
		return res.status(500).json({ success: false, message: 'Failed to create category' });
	}
});

// ==========================================
// 4. PUT /api/categories/:id
// Update an existing category
// ==========================================
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { id } = req.params;
		const { name, icon, color, type } = req.body;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const existingCategory = await prisma.category.findFirst({
			where: {
				id: String(id),
				userId: req.userId,
			},
		});

		if (!existingCategory) {
			return res.status(404).json({ success: false, message: 'Category not found' });
		}

		if (type && String(type) !== 'INCOME' && String(type) !== 'EXPENSE') {
			return res.status(400).json({
				success: false,
				message: 'type must be either \'INCOME\' or \'EXPENSE\'',
			});
		}

		const updatedCategory = await prisma.category.update({
			where: {
				id: String(id),
			},
			data: {
				name: name ? String(name).trim() : undefined,
				icon: icon ? String(icon) : undefined,
				color: color ? String(color) : undefined,
				type: type || undefined,
			},
			select: {
				id: true,
				userId: true,
				name: true,
				icon: true,
				color: true,
				type: true,
				_count: {
					select: { transactions: true, budgets: true },
				},
			},
		});

		return res.json({
			success: true,
			message: 'Category updated successfully',
			data: updatedCategory,
		});
	} catch (error: any) {
		if (error.code === 'P2002') {
			return res.status(409).json({ success: false, message: 'A category with this name already exists' });
		}
		console.error('Error updating category: ', error);
		return res.status(500).json({ success: false, message: 'Failed to update category' });
	}
});

// ==========================================
// 5. DELETE /api/categories/:id
// Delete a category
// ==========================================
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { id } = req.params;

		if (!req.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const existingCategory = await prisma.category.findFirst({
			where: {
				id: String(id),
				userId: req.userId,
			},
		});

		if (!existingCategory) {
			return res.status(404).json({ success: false, message: 'Category not found' });
		}

		await prisma.category.delete({
			where: { id: String(id) },
		});

		return res.json({
			success: true,
			message: 'Category deleted successfully',
		});
	} catch (error: any) {
		if (error.code === 'P2003') {
			return res.status(400).json({
				success: false,
				message: 'Cannot delete category because it has linked transactions. Reassign transactions first.',
			});
		}
		console.error('Error deleting category: ', error);
		return res.status(500).json({ success: false, message: 'Failed to delete category' });
	}
});

export default router;