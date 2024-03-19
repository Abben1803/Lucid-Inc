import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '../../../lib/prisma';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const bookmark = await prisma.bookmark.findMany({
          where: {
            user: {
              email: userEmail,
            },
          },
          include: {
            book: true,
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