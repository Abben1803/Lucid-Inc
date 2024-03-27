import React, { useEffect, useState} from 'react';

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AsideComponent from '../components/AsideComponent';
import { Book, Paragraph, Image } from '../lib/interfaces';



export default function story() { 
    const [book, setBook] = useState<Book | null>(null);
    const [currentParagraphIndex, setCurrentParagraphIndex] = useState(1);
    const router = useRouter();
    const { story: bookId } = router.query;
    const { data: session } = useSession();
    const [isBookmarked, setIsBookmarked] = useState(false);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            
            switch (event.key) {
                case 'ArrowRight':
                    setCurrentParagraphIndex((prevIndex) => Math.min(prevIndex + 1, book?.paragraphs?.length ?? 1));
                    break;
                case 'ArrowLeft':
                    setCurrentParagraphIndex((prevIndex) => Math.max(prevIndex - 1, 1));
                    break;
                default:
                    break;
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [book?.paragraphs?.length ?? 1]);

    useEffect(() => {
        const fetchBook = async () => {
            try{
                if(bookId && session ) {
                    const isAdmin = (session.user as { isAdmin?: boolean })?.isAdmin;
                    const url = isAdmin ? `/api/admin/${bookId}` : `/api/${bookId}`;
                    console.log('Fetching book from URL:', url);
                    const response = await fetch(url);
                    if(response.ok){
                        console.log('Response:', response.status);
                        const data = await response.json();
                        //console.log('Received book data:', data);
                        setBook(data);
                    }else if (response.status === 403) {
                        router.push('/Unauthorized/forbidden');
                    } else {
                        router.push('/404/notfound');
                    }
                }
            }catch(error){
                console.error('Error fetching book:', error);
            }
        };
    
        if (session) {
          fetchBook();
        }
    }, [bookId, session]);

    

    const handleFlagClick = async (event: any) => {
        event.preventDefault();
      
        try {
          if (bookId && session) {
            const response = await fetch('/api/flagged/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ bookId }),
            });
            if (response.ok) {
              alert('Book flagged successfully');
              router.push('/dashboard');
            }
          }
        } catch (error) {
          console.error('Error flagging book:', error);
        }
    }
    const handleDeleteClick = async (event: any) => {
        event.preventDefault();
    
        try {
            if (bookId && session) {
                const response = await fetch(`/api/admin/${bookId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    router.push('/dashboard');
                } else {
                    throw new Error('Failed to delete book');
                }
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const handleBookmarkClick = async (event: any) => {
        event.preventDefault();
      
        try {
          if (bookId && session) {
            const response = await fetch(`/api/${bookId}`, {
              method: isBookmarked ? 'DELETE' : 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ bookId }),
            });
            if (response.ok) {
              setIsBookmarked(!isBookmarked);
            }
          }
        } catch (error) {
          console.error('Error updating bookmark:', error);
        }
    };

    if (!session) return <div>Unauthorized</div>;
    if (!book) return <div>Loading...</div>;

    console.log(book.paragraphs.length);
    let finalIndex = book.paragraphs.length;
    let totalPages = book?.paragraphs?.length;  
    let lastParagraph = book.paragraphs[finalIndex-1].paragraph.length;

    if(lastParagraph == 0){
        book.paragraphs.pop();
        totalPages--;
    }

    console.log(book.paragraphs.length);


    console.log("Current image URL:", book.paragraphs?.[currentParagraphIndex - 1]?.image || 'No Image');

    //console.log(book.paragraphs[currentParagraphIndex - 1].paragraph.length)

    return (
        <div className="flex h-screen bg-base-200 text-base-content">
            <AsideComponent />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 h-full flex flex-col">
                    <div className="flex justify-end mb-4">
                        <button
                            className={`btn btn-sm ${isBookmarked ? 'btn-warning' : 'btn-ghost'}`}
                            onClick={handleBookmarkClick}
                            disabled={isBookmarked}
                            >
                            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                        </button>
                        
                        <button className="text-error text-sm" onClick = {handleFlagClick}>
                            Flag Story
                        </button>
                        {(session.user as { isAdmin?: boolean })?.isAdmin && (
                            <button className="text-error text-sm ml-2" onClick={handleDeleteClick}>
                                Delete Story
                            </button>
                        )}
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="text-center mb-4">
                            <div className="text-base-content font-bold text-lg">{book.title}</div>
                        </div>
                        <div className="flex-1 w-full max-w-2xl overflow-y-auto">
                            {book.paragraphs?.[currentParagraphIndex - 1] && (
                                <div className="flex justify-center items-center pt-12 mb-7">
                                    <img
                                        alt=""
                                        width={512}
                                        height={512}
                                        src={book.paragraphs?.[currentParagraphIndex - 1].image?.toString() || book.paragraphs?.[0].image?.toString()}
                                    />
                                </div>
                            )}
                            <p className="text-base-content text-sm border border-base-300 p-4">
                                {book.paragraphs?.[currentParagraphIndex - 1].paragraph}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => setCurrentParagraphIndex(prev => Math.max(prev - 1, 0))}
                            className="btn btn-sm btn-ghost"
                        >
                            Back
                        </button>
                        <div className="text-base-content text-sm">{currentParagraphIndex}</div>
                        <div className="text-base-content text-sm">{totalPages}</div>
                        <button
                            onClick={() => setCurrentParagraphIndex(prev => Math.min(prev + 1, totalPages))}
                            className="btn btn-sm btn-ghost"
                        >
                            Next
                        </button>
                    </div>
                    
                </div>
            </main>
        </div>
    );
}