import '@fortawesome/fontawesome-svg-core/styles.css';
import "../app/globals.css";
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/route';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { prisma } from '../lib/prisma';
import styles from '../components/newstory.module.css'
import AsideComponent from '../components/AsideComponent';


//import { Bookmark, Book } from '@prisma/client';

import { Book as PrismaBook, Bookmark } from '@prisma/client';

interface DashboardProps {
  session: Session | null;
  bookmarkedBooks: (Bookmark & { book: Book })[];
  additionalBooks: Book[];
}

type Book = PrismaBook & {
    paragraph: {
      image: {
        image: string;
      };
    }[];
  };

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);
    console.log('Session in getServerSideProps:', session);

  
    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    const userEmail = session.user?.email || null;

    const bookmarkedBooks = await prisma.bookmark.findMany({
            where: {
                user: {
                    email: userEmail? userEmail : undefined,
                },
            },
            include: {
                book: true,
            },
        });

    const additionalBooks = await prisma.book.findMany({
        where: {
            userEmail: userEmail? userEmail : undefined,
        },
        select: {
            id: true,
            title: true,
            paragraphs: {
                select: {
                    image: {
                        select: {
                            image:true,
                        },
                    },
                },
            },
        },
    });
  
    
  
    return {
      props: {
        session: {
          ...session,
          user: {
            email: userEmail,
          },
        },
        bookmarkedBooks,
        additionalBooks,
      },
    };
};
  


export default function dashboard({session, bookmarkedBooks, additionalBooks}: DashboardProps){
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const pages = Math.ceil(additionalBooks.length / itemsPerPage);
 
    const startIndex = (currentPage -1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBooks = additionalBooks.slice(startIndex, endIndex);

    console.log('Current page:', currentPage);

    return(
        <div className="flex h-screen bg-gray-100 text-black">
            <AsideComponent />
            <main className="flex-1 p-6">
                <h1 className="text-xl font-semibold mb-4">Hello, young storyteller!</h1>
                <div className="bg-white p-6 shadow-sm rounded-lg mb-8"> 
                    <h2 className="text-lg font-semibold mb-4">Your Recently Created Books</h2>
                    <div className={styles.gridContainer}>          
                        {currentBooks.map((book) => (
                            <Link key={book.id} href={`/${book.id}`} className={styles.bookCard}>
                                {book.paragraph?.[0]?.image?.image ? (
                                    <img
                                        src={book.paragraph[0].image?.toString()}
                                        alt={book.title}
                                        className="styles.bookImage"
                                    />
                                ) : (
                                    <div className={'${styles.bookImage} h-32'}></div>
                                )}
                                <div className={'${styles.title} text-center mt'}>{book.title}</div>
                            </Link>
                        ))}
                    </div>
                    <div className="flex justify-center">
                        {Array.from({ length: pages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`p-2 ${currentPage === i + 1 ? 'bg-gray-300' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Your Additional Tales</h2>
                    {additionalBooks.slice(0,4).map((recentbooks) => (
                        <div key={recentbooks.id} className="flex items-center mb-2">
                            <i className="fas fa-times text-gray-600 mr-2"></i>
                            <span>{recentbooks.title}</span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}