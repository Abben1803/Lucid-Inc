/*
  Warnings:

  - A unique constraint covering the columns `[bookId]` on the table `InputParams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InputParams_bookId_key" ON "InputParams"("bookId");
