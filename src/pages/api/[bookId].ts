import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
//import "../../app/global.css";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { bookId } = req.query;
  const session = await getServerSession(req, res, authOptions);
  console.log('Requested bookId:', bookId);

  if(!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // need to check if user is admin as well so he is able to see the content not sure how to implement yet.

  const userEmail = session.user?.email;
  const userId = session.user?.email;



  if(!userEmail) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try{
      const existingBookmark = await prisma.bookmark.findFirst({
        where: {
          bookId: parseInt(bookId as string, 10),
          userEmail: userEmail,
        },
      });
      if(!existingBookmark){
        const bookmark = await prisma.bookmark.create({
          data: {
            bookId: parseInt(bookId as string, 10),
            userEmail: userEmail,
          },
        });
        return res.status(201).json({ message: 'Bookmark created successfully' });
      }else if(existingBookmark){
        const bookmark = await prisma.bookmark.delete({
          where: {
            id: existingBookmark.id,
          },
        });
        return res.status(200).json({ message: 'Bookmark deleted successfully' });
      }
    } catch(error) {
      console.error('Error creating bookmark:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'GET') {
    try {

      const book = await prisma.book.findFirst({
        where: {
          id: parseInt(bookId as string, 10),
          userEmail: userEmail,
          flagged: null,
        },
        include: {
          paragraphs: {
            orderBy: { paragraphNumber: 'asc' },
            include: {
              image: true,
            },
          },
        },
      });



      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      const isBookmarked = await prisma.bookmark.findFirst({
        where: {
          bookId: parseInt(bookId as string, 10),
          userEmail: userEmail,
        },
      });

      const bookData = {
        id: book.id,
        title: book.title,
        paragraphs: book.paragraphs.map((paragraphs) => ({
          id: paragraphs.id,
          paragraph: paragraphs.paragraph,
          image: paragraphs.image?.image,
        })),
      
      };



      return res.status(200).json({...bookData, isBookmarked : !!isBookmarked});
      
    } catch (error) {
      console.error('Error fetching book:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
