import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faBook, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import "../../app/globals.css";
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '../../app/api/auth/[...nextauth]/route';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { prisma } from '../../lib/prisma';

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
      }[];
    }[];
  };

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);
  
    if (!session) {
      return {
        redirect: {
          destination: '/auth/login',
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
            paragraph: {
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

    useEffect(() => {
        if(!session){
            router.replace('auth/login');
        }
    }, [session, router]);

    return(
        <div className="flex h-screen bg-gray-100 text-black">
            <aside className="w-64 bg-white p-6 border-r border-gray-300">
                <div className="mb-8">
                    <div className="text-2xl font-bold mb-6">M.U.S.</div>
                    <div className="flex items-center mb-4 cursor-pointer">
                        <FontAwesomeIcon icon={faPen} className="text-gray-600 mr-2"/>
                        <span>New Story</span>
                        <Link href="./newstory"/>

                    </div>
                    <div className="flex items-center mb-4 cursor-pointer">
                        <FontAwesomeIcon icon={faBook} className="text-gray-600 mr-2"/>
                        <span>My Stories</span>
                    </div>
                </div>
                <div className="mb-8">
                    <div className="flex items-center mb-4 cursor-pointer">
                        <FontAwesomeIcon icon ={faCog} className=" text-gray-600 mr-2"/>
                        <span>Settings</span>
                    </div>
                    <div className="flex items-center cursor-pointer">
                        <FontAwesomeIcon icon={faSignOutAlt} className="fas fa-sign-out-alt text-gray-600 mr-2"/>
                        <span>Log out</span>
                    </div>
                </div>
            </aside>
            <main className="flex-1 p-6">
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <h1 className = "text-xl font-semibold mb-4"> Hello, young storyteller!</h1>
                    {additionalBooks.slice(0, 4).map((book) => (
                        <div key={book.id} className="border border-gray-300 p-4 bg-white shadow-sm">
                        {book.paragraph[0]?.image[0]?.image ? (
                            <img
                            src={book.paragraph[0].image[0].image}
                            alt={book.title}
                            className="h-32 object-cover w-full"
                            />
                        ) : (
                            <div className="h-32 bg-gray-200"></div>
                        )}
                        <div className="mt-2 text-center">{book.title}</div>
                        </div>
                    ))}
                </div>
                <div className = "mb-8">
                    <h2 className="text-lg font-semibold mb-4">Your Additional Tales</h2>
                    {additionalBooks.map((recentbooks) => (
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