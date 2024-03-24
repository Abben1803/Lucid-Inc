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
import { DashboardProps } from '../lib/interfaces';



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

    const additionalBooks = await prisma.book.findMany({
        where: {
            userEmail: userEmail? userEmail : undefined,
            flagged: null,
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
        additionalBooks,
      },
    };
};
  
export default function dashboard({additionalBooks}: DashboardProps){
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const pages = Math.ceil(additionalBooks.length / itemsPerPage);
 
    const startIndex = (currentPage -1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBooks = additionalBooks.slice(startIndex, endIndex);
    // console.log('Current image:', currentBooks[0]?.paragraphs?.[0]?.image);
    // console.log('Current page:', currentPage);
    return (
        <div className="flex h-screen bg-base-200 text-base-content">
          <AsideComponent />
          <main className="flex-1 p-6">
            <h1 className="text-2xl font-semibold mb-4">Hello, young storyteller!</h1>
            <div className="bg-base-100 p-6 shadow-sm rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Recently Created Books</h2>
              <div className={styles.gridContainer}>
                {currentBooks.map((book) => (
                  <Link key={book.id} href={`/${book.id}`} className={`${styles.bookCard} card`}>
                    {book.paragraphs?.[0]?.image?.image ? (
                      <img
                        src={book.paragraphs[0].image?.image}
                        alt={book.title}
                        className={`${styles.bookImage} card-img-top`}
                      />
                    ) : (
                      <div className={`${styles.bookImage} h-32 card-img-top`}></div>
                    )}
                    <div className={`${styles.title} card-body text-center`}>{book.title}</div>
                  </Link>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`btn btn-sm ${currentPage === i + 1 ? 'btn-active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
    );
}