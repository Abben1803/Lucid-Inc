import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/route';
import { Book } from '@prisma/client';
import { prisma } from '../lib/prisma';
import Link from 'next/link';


interface AdminProps {
  newBooks: Book[];
}


export default function AdminPage({ newBooks }: AdminProps) {
  return (
    <div>
      <h1>Admin Page</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {newBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>
                <Link href={`/${book.id}`}>
                  {book.title}
                </Link>
              </td>
              <td>{book.userEmail}</td>
              <td>{new Date(book.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// need to fix this function i need to implement book marking
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

    const serializedNewBooks = newBooks.map((book) => ({
      ...book,
      createdAt: book.createdAt.toISOString(),
    }));
  
    return {
      props: {
        newBooks: serializedNewBooks,
      },
    };
}
