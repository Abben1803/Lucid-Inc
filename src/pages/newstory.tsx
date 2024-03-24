import '@fortawesome/fontawesome-svg-core/styles.css';
import "../app/globals.css";
import styles from '../components/newstory.module.css'
import { GetServerSidePropsContext } from 'next';
import { authOptions } from '../app/api/auth/[...nextauth]/route';
import { getServerSession, Session } from 'next-auth';
import React from 'react';
import { useRouter } from 'next/router';
import AsideComponent from '../components/AsideComponent';
import { getSession } from 'next-auth/react';

interface DashboardProps {
    session: Session | null;
}


export default function newstory({session} : DashboardProps){

    const [selectedAge, setSelectedAge] = React.useState("");
    const [selectedLanguage, setSelectedLanguage] = React.useState("");
    const [selectedGenre, setSelectedGenre] = React.useState("");
    const [selectedArtStyle, setSelectedArtStyle] = React.useState("");
    const [storyPrompt, setStoryPrompt] = React.useState("")

    const router = useRouter();
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
            router.push(`/${data.bookId}`);
        } else {
            console.error('Failed to generate book');
        }
    }

    return(
        <div className="flex h-screen bg-gray-100 text-black">
            <AsideComponent />
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
                                    {['English', 'हिंदी', 'عربي'].map((language) => (
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


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);
  
    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    const userEmail = session.user?.email || null;

    
  
    return {
      props: {
        session: {
          ...session,
          user: {
            email: userEmail,
          },
        },

      },
    };
};
