import styles from  './newstory.module.css';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faBook, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import "../app/globals.css";
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Book{
    id: number;
    title: string;
    paragraphs: Paragraph[];
}

interface Paragraph{
    id: number;
    content: string;
    images: string[];
}

export default function story() { // Added parentheses after the function name
    const [book, setBook] = useState<Book | null>(null);
    const [title, setTitle] = useState("");
    const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
    const router = useRouter();
    const { story: bookId } = router.query;

    useEffect(() => {
        const fetchBook = async () => {
          console.log('Fetching book with ID:', bookId);
          const response = await fetch(`/api/book/${bookId}`);
          console.log('Response:', response)
          const data = await response.json();
          console.log('Received book data:', data);
          setBook(data);
        };
    
        if (bookId) {
          fetchBook();
        }
      }, [bookId]);

    useEffect(() => {
            const handleKeyDown = (event: KeyboardEvent) => {
                switch (event.key) {
                    case 'ArrowRight':
                        setCurrentParagraphIndex((prevIndex) => Math.min(prevIndex + 1, book?.paragraphs.length ?? 0 - 1));
                        break;
                    case 'ArrowLeft':
                        setCurrentParagraphIndex((prevIndex) => Math.max(prevIndex - 1, 0));
                        break;
                }
            };
        
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }, [book?.paragraphs.length]);


    if (!book) return <div>Loading...</div>;

    const totalPages = book.paragraphs.length;

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
                        {/* I have to next.link to the pages */}
                        <Link href="/user/settings"/>
                    </div>
                </div>
            </aside>
            <main>
                <div className="w-4/5 p-8">
                    <div className="flex justify-end mb-4">
                        <button className="text-red-500 text-sm">DELETE STORY</button>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-center mb-4">
                            <div className="text-gray-600 font-bold text-lg">{book.title}</div>
                            <div className="text-gray-600 text-sm">{currentParagraphIndex}</div>
                        </div>
                        {book.paragraphs[currentParagraphIndex].images.length > 0 && (
                            <div className="border border-gray-300 mb-4">
                                {/* Adjust according to how you want to display images, here's an example for the first image */}
                                <Image
                                    alt=""
                                    width={512}
                                    height={512}
                                    src={book.paragraphs[currentParagraphIndex].images[currentParagraphIndex]}

                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <div className="flex flex-col items-end">
                            <button className="text-gray-600 text-sm mb-2"><i className="fas fa-font"></i> Text Style</button>
                            <button className="text-gray-600 text-sm"><i className="fas fa-text-height"></i> Text Size</button>
                        </div>
                    </div>

                    <div className="bg-white p-4 border border-gray-300 mt-4">
                        <p className="text-gray-600 text-sm">
                            {book.paragraphs[currentParagraphIndex].content}
                        </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button onClick={() => setCurrentParagraphIndex(prev => Math.max(prev - 1, 0))} className="text-gray-600 text-sm">Back</button>
                        <button onClick={() => setCurrentParagraphIndex(prev => Math.min(prev + 1, totalPages - 1))} className="text-gray-600 text-sm">Next</button>
                    </div>
                    
                </div>
            </main>
        </div>
        
    );
}