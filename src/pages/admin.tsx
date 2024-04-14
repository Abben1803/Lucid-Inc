import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSession } from "next-auth/react";
import { Book } from "@prisma/client";
import { prisma } from "../lib/prisma";
import Link from "next/link";
import styles from "./adminStyles.module.css";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface AdminProps {
  newBooks: (Book & { flagged: boolean })[];
}

const AdminComponent = ({ newBooks }: AdminProps) => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div>
      <div className="flex mx-2 p-2">
        <Image
          src="/logo.png"
          alt="My Unique Story Logo"
          width={32}
          height={32}
        />
        <h1 className="ml-4">M.U.S - Admin Page</h1>
        <div
          className="ml-auto cursor-pointer hover:text-primary transition-colors duration-200"
          onClick={handleLogout}
        >
          <span>Log out</span>
        </div>
      </div>
      <h1 className="mx-2 p-2">
        Flagged Books are highlighted in{" "}
        <span className="text-red-500">RED</span>
      </h1>

      <table className={styles.adminTable}>
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
            <tr
              key={book.id}
              style={{ backgroundColor: book.flagged ? "red" : "transparent" }}
            >
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
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session || !(session.user as { isAdmin?: boolean }).isAdmin) {
    return {
      redirect: {
        destination: "/notfound/",
        permanent: false,
      },
    };
  }

  const newBooks = await prisma.book.findMany({
    orderBy: {
      createdAt: "desc",
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

export default function AdminPage({
              newBooks,
            }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <AdminComponent newBooks={newBooks} />;
}
