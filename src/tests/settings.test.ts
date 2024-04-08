import settingsHandler from '../app/api/settings/settings';
import { prisma } from '../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/route';

jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      update: jest.fn(),
    },
  },
}));

jest.mock('next-auth', () => {
  const originalModule = jest.requireActual('next-auth');
  const mockSession = {
    user: { email: 'test@example.com' },
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
  };
  return {
    __esModule: true,
    ...originalModule,
    getServerSession: jest.fn().mockResolvedValue(mockSession),
  };
});

describe('PUT /api/updateUser', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      method: 'PUT',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'newpassword',
      }),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update user information', async () => {
    const updatedUser = { email: 'test@example.com' };
    (prisma.user.update as jest.Mock).mockResolvedValueOnce(updatedUser);

    await settingsHandler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedUser);
  });
});