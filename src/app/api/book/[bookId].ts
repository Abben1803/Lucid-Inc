import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { bookId } = req.query;

  if (req.method === 'GET') {
    try {
      const book = await prisma.book.findUnique({
        where: { id: parseInt(bookId as string, 10) },
        include: {
          paragraph: {
            orderBy: { paragraphNumber: 'asc' },
            include: {
              image: true,
            },
          },
        },
      });

      console.log('book:', book)

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const bookData = {
        id: book.id,
        title: book.title,
        paragraphs: book.paragraph.map((paragraph) => ({
          id: paragraph.id,
          content: paragraph.paragraph,
          images: paragraph.image.map((image) => image.image),
        })),
      };

      return res.status(200).json(bookData);
    } catch (error) {
      console.error('Error fetching book:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
