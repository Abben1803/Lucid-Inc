/*
  Warnings:

  - You are about to drop the column `userId` on the `Bookmark` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `Bookmark` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_userId_fkey";

-- AlterTable
ALTER TABLE "Bookmark" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
