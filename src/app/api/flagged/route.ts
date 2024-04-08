import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { bookId } = await req.json();

  try {
    // Check if the book is already flagged
    const existingFlag = await prisma.flagged.findFirst({
      where: { bookId: parseInt(bookId, 10) },
    });

    if (existingFlag) {
      return NextResponse.json({ message: 'Book is already flagged' }, { status: 400 });
    }

    // Flag the book
    await prisma.flagged.create({
      data: { bookId: parseInt(bookId, 10) },
    });

    return NextResponse.json({ message: 'Book flagged successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error flagging book:', error);
    return NextResponse.json({ message: 'Internal server error: ' + error.message }, { status: 500 });
  }
}