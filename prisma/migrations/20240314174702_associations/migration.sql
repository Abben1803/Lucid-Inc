/*
  Warnings:

  - A unique constraint covering the columns `[bookId]` on the table `AdminReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AdminReview_bookId_key" ON "AdminReview"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_bookId_key" ON "Bookmark"("bookId");
