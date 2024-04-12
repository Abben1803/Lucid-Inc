import { POST } from '../app/api/flagged/route';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';

jest.mock('next-auth/next');
jest.mock('@/lib/prisma', () => ({
    prisma: {
      flagged: {
        findFirst: jest.fn(),
        create: jest.fn(),
      }
    }
}));

describe('POST /api/flagged', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('Flagging a book successfully', async () => {
        // Mock session
        const session = { user: { email: 'test@example.com' } };
        (getServerSession as jest.Mock).mockResolvedValue(session);

        // Mock request
        const bookId = 1;
        const req = new NextRequest('http://localhost:3000/api/flagged', {
        method: 'POST',
        body: JSON.stringify({ bookId }),
        });

        // Mock database response (no existing flags)
        (prisma.flagged.findFirst as jest.Mock).mockResolvedValue(null);

        // Mock database creation
        (prisma.flagged.create as jest.Mock).mockResolvedValue({});

        // Call the API route
        const res = await POST(req);

        // Assert the response
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ message: 'Book flagged successfully' });
    });

    test('Flagging an already flagged book', async () => {
        // Mock session
        const session = { user: { email: 'test@example.com' } };
        (getServerSession as jest.Mock).mockResolvedValue(session);

        // Mock request
        const bookId = 1;
        const req = new NextRequest('http://localhost:3000/api/flagged', {
        method: 'POST',
        body: JSON.stringify({ bookId }),
        });

        // Mock database response (existing flag)
        (prisma.flagged.findFirst as jest.Mock).mockResolvedValue({});

        // Call the API route
        const res = await POST(req);

        // Assert the response
        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ message: 'Book is already flagged' });
    });

    test('Unauthorized request', async () => {
        // Mock session as null (unauthenticated)
        (getServerSession as jest.Mock).mockResolvedValue(null);

        // Mock request
        const req = new NextRequest('http://localhost:3000/api/flagged', {
        method: 'POST',
        body: JSON.stringify({ bookId: 1 }),
        });

        // Call the API route
        const res = await POST(req);

        // Assert the response
        expect(res.status).toBe(401);
        expect(await res.json()).toEqual({ message: 'Unauthorized' });
    });

    test('Internal server error', async () => {
        // Mock session
        const session = { user: { email: 'test@example.com' } };
        (getServerSession as jest.Mock).mockResolvedValue(session);

        // Mock request
        const req = new NextRequest('http://localhost:3000/api/flagged', {
        method: 'POST',
        body: JSON.stringify({ bookId: 1 }),
        });

        // Mock database error
        (prisma.flagged.findFirst as jest.Mock).mockRejectedValue(new Error('Database error'));

        // Call the API route
        const res = await POST(req);

        // Assert the response
        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({ message: 'Internal server error: Database error' });
    });
});
