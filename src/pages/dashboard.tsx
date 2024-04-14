import "@fortawesome/fontawesome-svg-core/styles.css";
import "../app/globals.css";
import Link from "next/link";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { prisma } from "../lib/prisma";
import styles from "../components/newstory.module.css";
import AsideComponent from "../components/AsideComponent";
import Image from "next/image";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  console.log("Session in getServerSideProps:", session);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const userEmail = session.user?.email || null;

  const additionalBooks = await prisma.book.findMany({
    where: {
      userEmail: userEmail ? userEmail : undefined,
      flagged: null,
    },
    orderBy: {
      createdAt: "desc", // Assuming 'createdAt' is the field you want to sort by
    },
    select: {
      id: true,
      title: true,
      paragraphs: {
        select: {
          image: {
            select: {
              image: true,
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
}

const DashboardComponent = ({
  additionalBooks,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAsideOpen, setIsAsideOpen] = useState(true);
  const toggleAside = () => {
    setIsAsideOpen(!isAsideOpen);
  };

  const itemsPerPage = 4;

  const pages = Math.ceil(additionalBooks.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = additionalBooks.slice(startIndex, endIndex);

  if (additionalBooks.length === 0) {
    return (
      <div className="flex h-screen bg-base-200 text-base-content">
        <AsideComponent isOpen={isAsideOpen} toggleAside={toggleAside} />
        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            isAsideOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="mt-6 p-6 shadow-sm rounded-lg mb-8 bg-base-100 flex items-center justify-center">
            <div className="flex-col items-center justify-center text-center">
              <div className="mb-4 flex justify-center w-full">
                <Image
                  src="/images/no_stories.png" // The path to your image file
                  alt="Encouragement for creating new stories"
                  width={512} // The width you desire
                  height={512} // The height you desire
                  className="rounded-lg shadow-lg"
                />
              </div>
              <p className="text-lg mb-4">
                Hey young reader, you haven't created any stories yet.
              </p>
              <p className="mb-4">
                Click on 'New Story' below (or on the left side) and bring your imagination
                to life right now!
              </p>
              <Link href="/newstory" className="btn btn-accent btn-lg">
                Create a New Story
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-base-200 text-base-content">
      <AsideComponent isOpen={isAsideOpen} toggleAside={toggleAside} />
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          isAsideOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="mt-6 p-6 shadow-sm rounded-lg mb-8 bg-base-100">
          <h2 className="text-xl font-semibold mb-4">
            Your Recently Crafted Story Books
          </h2>
          <div className={styles.gridContainer}>
            {currentBooks.map((book) => (
              <Link
                key={book.id}
                href={`/${book.id}`}
                className="card shadow-2xl rounded-lg hover:bg-primary/50 transition duration-300 overflow-hidden"
              >
                <div className="relative w-full h-96">
                  {" "}
                  {/* Container with fixed height and hidden overflow */}
                  {book.paragraphs?.[0]?.image?.image ? (
                    <Image
                      src={book.paragraphs[0].image.image}
                      alt={book.title}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-110 rounded-t-lg" // Scale image on hover
                    />
                  ) : (
                    <div className="bg-base-300 w-full h-full rounded-t-lg"></div> // Placeholder if no image
                  )}
                </div>
                <h3 className="card-body text-2xl font-bold text-center p-4">
                  {book.title}
                </h3>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`btn btn-sm mx-2 btn-secondary ${
                  currentPage === i + 1 ? "btn-accent" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default function DashboardPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return <DashboardComponent {...props} />;
}
