/*
  Warnings:

  - The `type` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('INCOME', 'EXPENSE');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "type",
ADD COLUMN     "type" "CategoryType" NOT NULL DEFAULT 'EXPENSE';

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "type";

-- DropEnum
DROP TYPE "TransactionType";
