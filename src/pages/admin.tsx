import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/route';
import { Book } from '@prisma/client';
import { prisma } from '../lib/prisma';

interface AdminProps {
  newBooks: Book[];
}

export default function Admin({ newBooks }: AdminProps) {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>New Books</h2>
      {newBooks.length > 0 ? (
        <ul>
          {newBooks.map((book) => (
            <li key={book.id}>
              <h3>{book.title}</h3>
              <p>Author: {book.userEmail}</p>
              <p>Created At: {book.createdAt.toISOString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No new books found.</p>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session || !(session.user as { isAdmin?: boolean }).isAdmin) {
        return {
        redirect: {
            destination: '/notfound/',
            permanent: false,
        },
        };
    }

    const newBooks = await prisma.book.findMany({
        where: {
          adminReview: {}
        },
        orderBy: {
          createdAt: 'desc',
        },
    });

    return {
        props: {
        newBooks,
        },
    };
}