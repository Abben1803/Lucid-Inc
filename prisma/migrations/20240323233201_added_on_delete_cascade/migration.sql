-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Flagged" DROP CONSTRAINT "Flagged_bookId_fkey";

-- DropForeignKey
ALTER TABLE "InputParams" DROP CONSTRAINT "InputParams_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_bookId_fkey";

-- AddForeignKey
ALTER TABLE "InputParams" ADD CONSTRAINT "InputParams_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flagged" ADD CONSTRAINT "Flagged_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
