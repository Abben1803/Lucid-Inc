/*
  Warnings:

  - A unique constraint covering the columns `[bookId,userEmail]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Bookmark_bookId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_bookId_userEmail_key" ON "Bookmark"("bookId", "userEmail");
