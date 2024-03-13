/*
  Warnings:

  - You are about to drop the column `userId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `paragraphs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userEmail` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_userId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_paragraphID_fkey";

-- DropForeignKey
ALTER TABLE "paragraphs" DROP CONSTRAINT "paragraphs_bookId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- DropTable
DROP TABLE "paragraphs";

-- CreateTable
CREATE TABLE "Paragraph" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "paragraph" TEXT NOT NULL,
    "paragraphNumber" INTEGER NOT NULL,

    CONSTRAINT "Paragraph_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_paragraphID_fkey" FOREIGN KEY ("paragraphID") REFERENCES "Paragraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
