import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSession } from 'next-auth/react';
import { Book } from '@prisma/client';
import { prisma } from '../lib/prisma';
import Link from 'next/link';



interface AdminProps {
  newBooks: (Book & { flagged: boolean })[];
}

const AdminComponent = ({ newBooks }: AdminProps) => {
  return (
    <div>
      <h1>Admin Page</h1>
      <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Created At</th>
            </tr> 
          </thead>
        <tbody>
          {newBooks.map((book) => (
            <tr key={book.id} style={{ backgroundColor: book.flagged ? 'red' : 'transparent' }}>
              <td>{book.id}</td>
              <td>
                <Link href={`/${book.id}`}>{book.title}</Link>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session || !(session.user as { isAdmin?: boolean }).isAdmin) {
    return {
      redirect: {
        destination: '/notfound/',
        permanent: false,
      },
    };
  }

  const newBooks = await prisma.book.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      flagged: true,
    },
  });

  const serializedNewBooks = newBooks.map((book) => ({
    ...book,
    createdAt: book.createdAt.toISOString(),
    flagged: !!book.flagged,
  }));

  return {
    props: {
      newBooks: serializedNewBooks,
    },
  };
}

export default function AdminPage({ newBooks }: AdminProps) {
  return <AdminComponent newBooks={newBooks} />;
}