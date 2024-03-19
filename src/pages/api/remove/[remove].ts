import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../app/api/auth/[...nextauth]/route';
import { prisma } from '../../../lib/prisma';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { bookId } = req.body;
    try {
      const bookmark = await prisma.bookmark.deleteMany({
        where: {
          bookId: bookId,
          user: {
            email: userEmail,
          },
        },
      });

      res.status(200).json(bookmark);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}