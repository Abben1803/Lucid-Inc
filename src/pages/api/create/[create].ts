import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../app/api/auth/[...nextauth]/route';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { bookId } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      const bookmark = await prisma.bookmark.create({
        data: {
          book: {
            connect: {
              id: bookId,
            },
          },
          user: {
            connect: {
              email: userEmail,
            },
          },
        },
      });

      res.status(201).json(bookmark);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}