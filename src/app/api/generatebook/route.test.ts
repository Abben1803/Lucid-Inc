import { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { POST, getStory, getPrompts, generateAndSaveImagesDallE, getTitle } from './route';



const prismaMock = {
  book: {
    create: jest.fn(),
  },
};

jest.mock('../../../lib/prisma', () => ({
  prisma: prismaMock,
}));

jest.mock('next-auth');
jest.mock('./route');

describe('POST', () => {
  let req: Partial<Request>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      json: jest.fn().mockResolvedValue({
        prompt: 'Once upon a time...',
        age: '5',
        language: 'en',
        genre: 'fantasy',
        artstyle: 'cartoon',
      }),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a book and return its ID', async () => {
    const mockSession = { user: { email: 'test@example.com' } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);

    const mockStoryParagraphs = ['Paragraph 1', 'Paragraph 2'];
    (getStory as jest.Mock).mockResolvedValueOnce(mockStoryParagraphs);

    const mockImagePrompts = ['Prompt 1', 'Prompt 2'];
    (getPrompts as jest.Mock).mockResolvedValueOnce(mockImagePrompts);

    const mockImagePaths = ['image1.png', 'image2.png'];
    (generateAndSaveImagesDallE as jest.Mock).mockResolvedValueOnce(mockImagePaths);

    const mockTitle = 'My Book';
    (getTitle as jest.Mock).mockResolvedValueOnce(mockTitle);

    const mockBookId = 'book-id';
    (prismaMock.book.create as jest.Mock).mockResolvedValueOnce({ id: mockBookId });

    await POST(req as Request, res as NextApiResponse);

    expect(getServerSession).toHaveBeenCalledWith(authOptions);
    expect(getStory).toHaveBeenCalledWith('Once upon a time...', '5', 'en', 'fantasy', 'cartoon');
    expect(getPrompts).toHaveBeenCalledWith('Paragraph 1|Paragraph 2', 'cartoon');
    expect(generateAndSaveImagesDallE).toHaveBeenCalledWith(mockImagePrompts);
    expect(getTitle).toHaveBeenCalledWith('Paragraph 1|Paragraph 2', 'en');
    expect(prismaMock.book.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        title: mockTitle,
        userEmail: 'test@example.com',
        inputParams: expect.any(Object),
        paragraphs: expect.any(Object),
      }),
    }));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ bookId: mockBookId });
  });

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    await POST(req as Request, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
  });
});