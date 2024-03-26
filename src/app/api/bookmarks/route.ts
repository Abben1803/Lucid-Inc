import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';




export async function POST(req: NextApiRequest, res: NextApiResponse){
  const session = await getSession({ req });
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
}