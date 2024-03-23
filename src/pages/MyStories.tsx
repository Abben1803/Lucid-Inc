import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AsideComponent from '../components/AsideComponent';
import "../app/globals.css";
import { Book, Bookmark } from '../lib/interfaces';


type BookWithBookmark = Bookmark & { book: Book };



const MyStoriesPage = () => {
  const { data: session } = useSession();
  const [bookmarkedBooks, setBookmarkedBooks] = useState<(Bookmark & { book: Book })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedBooks = async () => {
      if (session) {
        try {
          const response = await fetch('/api/bookmarks', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setBookmarkedBooks(data);
          } else {
            console.error('Failed to fetch bookmarked books');
          }
        } catch (error) {
          console.error('Error fetching bookmarked books:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBookmarkedBooks();
  }, [session]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-base-200 text-base-content">
      <AsideComponent />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-4xl font-bold mb-8">My Stories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {bookmarkedBooks.map((bookmark) => (
            <div key={bookmark.id} className="card bg-base-100 shadow-xl">
              <figure>
                <img src={bookmark.book.paragraphs[0].image?.image} alt={bookmark.book.title} />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{bookmark.book.title}</h2>
                <p>Bookmarked on: {new Date(bookmark.date).toLocaleDateString()}</p>
                <div className="card-actions justify-end">
                  <a href={`/book/${bookmark.book.id}`} className="btn btn-primary">
                    Read Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyStoriesPage;