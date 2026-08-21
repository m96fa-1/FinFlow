import 'dotenv/config'
import { PrismaClient, TransactionType } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const categories = [
	{ name: 'Housing & Rent', 	icon: 'house', 							color: '#2B8DAE', 	type: TransactionType.EXPENSE },
	{ name: 'Food & Groceries', icon: 'shopping-basket', 		color: '#239DAA', 	type: TransactionType.EXPENSE },
	{ name: 'Transportation', 	icon: 'car', 								color: '#1AAEA6', 	type: TransactionType.EXPENSE },
	{ name: 'Entertainment', 		icon: 'gamepad-2', 					color: '#12BFA2', 	type: TransactionType.EXPENSE },
	{ name: 'Income / Salary', 	icon: 'banknote-arrow-up', 	color: '#0AD09E', 	type: TransactionType.INCOME 	},
	{ name: 'Utilities', 				icon: 'zap', 								color: '#01E19A', 	type: TransactionType.EXPENSE },
];

async function main() {
	console.log('Seeding initial categories...');
	for (const category of categories) {
		const existingCategory = await prisma.category.findFirst({
			where: {
				name: category.name,
				userId: null,
			},
		});
		if (existingCategory) {
			await prisma.category.update({
				where: { id: existingCategory.id },
				data: {
					type: category.type,
					icon: category.icon,
					color: category.color,
				},
			});
		} else {
			await prisma.category.create({
				data: {
					name: category.name,
					icon: category.icon,
					color: category.color,
					type: category.type,
					userId: null,
				},
			});
		}
	}
	console.log('Seeding finished successfully!');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});