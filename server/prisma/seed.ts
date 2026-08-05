import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const categories = [
  { name: 'Housing & Rent', icon: 'home', color: '#EF4444' },
  { name: 'Food & Groceries', icon: 'shopping-cart', color: '#F59E0B' },
  { name: 'Transportation', icon: 'car', color: '#3B82F6' },
  { name: 'Entertainment', icon: 'film', color: '#8B5CF6' },
  { name: 'Income / Salary', icon: 'dollar-sign', color: '#10B981' },
  { name: 'Utilities', icon: 'zap', color: '#6366F1' },
];

async function main() {
  console.log('Seeding initial categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
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