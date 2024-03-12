import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faBook, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css';
import "../../app/globals.css";
import styles from './newstory.module.css'

import React from 'react';
import router from 'next/router';

import Link from 'next/link';
import { getSession } from 'next-auth/react';


export default function newstory(){

    const [selectedAge, setSelectedAge] = React.useState("");
    const [selectedLanguage, setSelectedLanguage] = React.useState("");
    const [selectedGenre, setSelectedGenre] = React.useState("");
    const [selectedArtStyle, setSelectedArtStyle] = React.useState("");
    const [storyPrompt, setStoryPrompt] = React.useState("")

    const handleAgeSelection = (age: string) => {
        setSelectedAge(age);
    };

    const handleLanguageSelection = (language: string) => {
        setSelectedLanguage(language);
    };

    const handleGenreSelection = (genre: string) => {
        setSelectedGenre(genre);
    };

    const handleArtStyleSelection = (artStyle: string) => {
        setSelectedArtStyle(artStyle);
    }


    const handleSubmit = async () => {
        const session = await getSession(); // Get the client-side session
        const userId = session?.user?.email; // Extract the userId from the session
    
        if (!userId) {
            console.error('User not authenticated');
            return;
        }
    
        const storyData = {
            userId, // Include the userId in the request body
            prompt: storyPrompt,
            age: selectedAge,
            language: selectedLanguage,
            genre: selectedGenre,
            artstyle: selectedArtStyle
        };
    
        const response = await fetch('/api/generatebook', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(storyData)
        });
        
        const data = await response.json();
    
        if (data.bookId) {
            router.push(`/mystory/${data.bookId}`);
        } else {
            console.error('Failed to generate book');
        }
    }

    return(
        <div className="flex h-screen bg-gray-100 text-black">
            <aside className="w-64 bg-white p-6 border-r border-gray-300">
                <div className="mb-8">
                    <div className="text-2xl font-bold mb-6">M.U.S.</div>
                    <div className="flex items-center mb-4 cursor-pointer">
                        <FontAwesomeIcon icon={faPen} className="text-gray-600 mr-2"/>
                        <span>New Story</span>
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
            <div className="flex-1 bg-gray-100 p-8">
                
                <main>
                    <section className="mb-4">
                        <h2 className="font-semibold mb-2">Create Your Own Story</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-1">Choose your age</label>
                                <div className="flex gap-2">
                                    {['6', '7', '8', '9', '10'].map((age) => (
                                        <button
                                            key={age}
                                            className={`border-2 border-black w-12 h-12 ${selectedAge === age ? styles.selected : ''}`}
                                            onClick={() => handleAgeSelection(age)}
                                        >
                                            {age}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1">Choose your language</label>
                                <div className="flex gap-2">
                                    {['English', '中文', 'हिंदी'].map((language) => (
                                        <button
                                            key={language}
                                            className={`border-2 border-black px-4 py-2 ${selectedLanguage === language ? styles.selected : ''}`}
                                            onClick={() => handleLanguageSelection(language)}
                                        >
                                            {language}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1">Give us a glimpse into your story</label>
                                <textarea className="border-2 border-black w-full h-24 p-2" placeholder="For eg. This story is about a boy named Esh, he's a wizard and doesn't know" value = {storyPrompt} 
                                    onChange={(e) => {
                                        const newPrompt = e.target.value;
                                        if (newPrompt.length <= 200) {
                                            setStoryPrompt(newPrompt);
                                        }
                                        setStoryPrompt(newPrompt.slice(0, 200));
                                    }}       
                                ></textarea>
                                <div className="text-right">{storyPrompt.length}/200</div>
                            </div>
                        </div>
                    </section>
                    <section className="mb-4">
                        <h2 className="font-semibold mb-2">Pick a genre</h2>
                        <div className="grid grid-cols-4 gap-4">
                            {['Adventure', 'Fantasy', 'Mystery', 'Action/Super-hero'].map((genre) => (
                                <button
                                    key={genre}
                                    className={`${styles['genre-art-style']} border-2 border-black p-4 text-center ${selectedGenre === genre ? styles.selected : ''}`}
                                    onClick={() => handleGenreSelection(genre)}
                                >
                                    <img src={`https://placehold.co/100x100`} alt={`Placeholder image for ${genre} genre`} />
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </section>
                    <section className="mb-4">
                        <h2 className="font-semibold mb-2">Pick an art-style</h2>
                        <div className="grid grid-cols-4 gap-4">
                            {['Classic', 'Comic Book', 'Manga', 'Cartoon'].map((artStyle) => (
                                <button
                                    key={artStyle}
                                    className={`${styles['genre-art-style']} border-2 border-black p-4 text-center ${selectedArtStyle === artStyle ? styles.selected : ''}`}
                                    onClick={() => handleArtStyleSelection(artStyle)}
                                >
                                    <img src={`https://placehold.co/100x100`} alt={`Placeholder image for ${artStyle} art style`} />
                                    {artStyle}
                                </button>
                            ))}
                        </div>
                    </section>
                    <div className="text-center">
                        <button className="border-2 border-black px-8 py-2" onClick = {handleSubmit}>MAKE MY STORY</button>
                    </div>
                </main>
            </div>
        </div>
    );


}

