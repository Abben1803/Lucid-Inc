import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const session = await getServerSession(authOptions);

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { email, password } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: {
          email: session.user?.email || '',
        },
        data: {
          email,
          password,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}