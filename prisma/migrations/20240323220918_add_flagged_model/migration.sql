/*
  Warnings:

  - You are about to drop the `AdminReview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdminReview" DROP CONSTRAINT "AdminReview_bookId_fkey";

-- DropTable
DROP TABLE "AdminReview";

-- CreateTable
CREATE TABLE "Flagged" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "flaggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Flagged_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flagged_bookId_key" ON "Flagged"("bookId");

-- AddForeignKey
ALTER TABLE "Flagged" ADD CONSTRAINT "Flagged_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
