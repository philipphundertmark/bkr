-- CreateEnum
CREATE TYPE "Order" AS ENUM ('ASC', 'DESC');

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "members" TEXT[],
    "code" TEXT NOT NULL,
    "order" "Order" NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Station_number_key" ON "Station"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Station_code_key" ON "Station"("code");
