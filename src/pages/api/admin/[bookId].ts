import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { bookId } = req.query;
  const session = await getServerSession(req, res, authOptions);
  console.log('Requested bookId:', bookId);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const isAdmin = (session.user as { isAdmin?: boolean })?.isAdmin;

  if (!isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'DELETE') {
    try {
      // Delete associated InputParams records
      await prisma.inputParams.deleteMany({
        where: {
          bookId: parseInt(bookId as string, 10),
        },
      });

      // Delete associated Paragraph records
      await prisma.paragraph.deleteMany({
        where: {
          bookId: parseInt(bookId as string, 10),
        },
      });

      // Delete associated Bookmark record
      await prisma.bookmark.deleteMany({
        where: {
          bookId: parseInt(bookId as string, 10),
        },
      });

      // Delete associated Flagged record
      await prisma.flagged.deleteMany({
        where: {
          bookId: parseInt(bookId as string, 10),
        },
      });

      // Delete the book
      const deletedBook = await prisma.book.delete({
        where: {
          id: parseInt(bookId as string, 10),
        },
      });

      console.log('Deleted book:', deletedBook);
      return res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.error('Error deleting book:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  if (req.method === 'GET') {
    try {
      const book = await prisma.book.findFirst({
        where: {
          id: parseInt(bookId as string, 10),
        },
        include: {
          paragraphs: {
            orderBy: { paragraphNumber: 'asc' },
            include: { image: true },
          },
        },
      });

      console.log('Retrieved book from database:', book);

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const bookData = {
        id: book.id,
        title: book.title,
        paragraphs: book.paragraphs.map((paragraphs) => ({
          id: paragraphs.id,
          paragraph: paragraphs.paragraph,
          image: paragraphs.image?.image,
        })),
      };

      console.log('Book data:', bookData);
      return res.status(200).json(bookData);
    } catch (error) {
      console.error('Error fetching book:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}