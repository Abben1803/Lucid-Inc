import React, { useEffect, useState} from 'react';
import Image from 'next/image';
import "../app/globals.css";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AsideComponent from '../components/AsideComponent';

interface Book {
    id: number;
    title: string;
    paragraphs: Paragraph[];
}

interface Paragraph {
    id: number;
    paragraph: string;
    image?: Image;
}

interface Image {
    id: number;
    image: string;
}

export default function story() { 
    const [book, setBook] = useState<Book | null>(null);
    const [title, setTitle] = useState("");
    const [currentParagraphIndex, setCurrentParagraphIndex] = useState(1);
    const router = useRouter();
    const { story: bookId } = router.query;
    const { data: session } = useSession();
    
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
                    const url = `/api/${bookId}`;
                    console.log('Fetching book from URL:', url);
                    const response = await fetch(url);
                    if(response.ok){
                        console.log('Response:', response.status);
                        const data = await response.json();
                        console.log('Received book data:', data);
                        setBook(data);
                    }else {
                        return <div>Unauthorized</div>;
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

    if(!session) return <div>Unauthorized</div>;
    if (!book) return <div>Loading...</div>;
        

    const totalPages = book.paragraphs.length;
    console.log("Current image URL:", book.paragraphs[currentParagraphIndex-1].image || 'No Image');

    return(
        <div className="flex h-screen bg-gray-100 text-black">
            <AsideComponent />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 h-full flex flex-col">
                    <div className="flex justify-end mb-4">
                        <button className="text-red-500 text-sm">Flag Story</button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="text-center mb-4">
                            <div className="text-gray-600 font-bold text-lg">{book.title}</div>
                        </div>
                        <div className="flex-1 w-full max-w-2xl overflow-y-auto">
                            {book.paragraphs[currentParagraphIndex - 1] && (
                                <div className="flex justify-center items-center pt-12 mb-7">
                                    <img
                                        alt=""
                                        width={512}
                                        height={512}
                                        src={book.paragraphs[currentParagraphIndex - 1].image?.toString()}
                                    />
                                </div>
                            )}
                            <p className="text-black text-sm border">
                                {book.paragraphs[currentParagraphIndex - 1].paragraph}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => setCurrentParagraphIndex(prev => Math.max(prev - 1, 0))}
                            className="text-gray-600 text-sm"
                        >
                            Back
                        </button>
                        <div className="text-gray-600 text-sm">{currentParagraphIndex}</div>
                        <div className="text-gray-600 text-sm">{totalPages}</div>
                        <button
                            onClick={() => setCurrentParagraphIndex(prev => Math.min(prev + 1, totalPages))}
                            className="text-gray-600 text-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>
        </div>
        
    );
}