-- CreateEnum
CREATE TYPE "Ranking" AS ENUM ('A', 'B');

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "ranking" "Ranking" NOT NULL DEFAULT 'A';
