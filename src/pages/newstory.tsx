import '@fortawesome/fontawesome-svg-core/styles.css';
import "../app/globals.css";
import styles from '../components/newstory.module.css'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useState, useEffect } from 'react';
import AsideComponent from '../components/AsideComponent';
import { getSession } from 'next-auth/react';
import LoadingOverlay from '../components/LoadingOverlay';
import router from 'next/router';
import Image from 'next/image';
import Filter from 'bad-words';




const NewStoryComponent = ({session}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

    const [selectedAge, setSelectedAge] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedArtStyle, setSelectedArtStyle] = useState("");
    const [storyPrompt, setStoryPrompt] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isAsideOpen, setIsAsideOpen] = useState(true);
    const customBadWords = [
        'pig', 'kill', 'hate', 'stupid', 'idiot', 'hell', 'alcohol', 'casino', 
        'bet', 'pork', 'swine', 'sex', 'gay', 'dictatorship', 'naked', 'nude', 'beer', 
        'wine', 'vodka', 'whiskey', 'drunk', 'gamble', 'lottery', 'terrorist', 
        'bomb', 'gun', 'shoot', 'murder', 'assassinate', 'theft', 'steal', 'rob', 
        'rape', 'porn', 'porno', 'prostitute', 'hooker', 'genocide', 'ethnic cleansing', 
        'suicide', 'devil', 'satan', 'infidel', 'kafir', 'jihad', 'sharia', 
        'talaq', 'fatwa', 'haram', 'halal', 'niqab', 'hijab', 'burqa', 
        'jinn', 'magic', 'sorcery', 'witchcraft', 'curse', 'damn', 'sodomy', 
        'lesbian', 'homosexuality', 'queer', 'LGBT', 'LGBTQ', 'transgender', 'bisexual', 
        'fag', 'faggot', 'dyke', 'slut', 'whore', 'bitch', 'bastard', 
        'ass', 'arse', 'scum', 'communism', 'fascism', 'nazi', 'hitler', 
        'isis', 'taliban', 'al-Qaeda', 'syndicate', 'mafia', 'yakuza', 
        'rebel', 'rebellion', 'anarchy', 'anarchist', 'riot', 'rioter', 
        'looter', 'corruption', 'corrupt', 'bribe', 'kickback', 'embezzle', 
        'embezzlement', 'fraud', 'scandal', 'conspiracy', 'plot', 'scheme', 
        'drug', 'cocaine', 'heroin', 'marijuana', 'cannabis', 'weed', 'opium', 
        'abuse', 'abuser', 'violence', 'violent', 'aggression', 'aggressive', 
        'attack', 'assault', 'harm', 'hurt', 'damage', 'danger', 'threat', 
        'menace', 'abortion', 'miscarriage', 'adultery', 'fornication', 'illegitimate',
        'bastard', 'incest', 'sibling rivalry', 'envy', 'jealous', 'covet', 'greed', 
        'lust', 'pride', 'sloth', 'wrath', 'gluttony', 'envy', 'vanity',
        'deceit', 'lie', 'liar', 'deceive', 'cheat', 'fraudulent', 'dishonest'
    ];
    
    const customFilter = new Filter({ list: customBadWords });

    const handleChange = (e) => {
        const newPrompt = e.target.value.slice(0, 200); // Ensures it's always within the limit
        if (!customFilter.isProfane(newPrompt)) {
            setStoryPrompt(newPrompt);
        } else {
            alert('Please avoid using inappropriate language.');
        }
    };

    const validateForm = () => {
        return (
            selectedAge !== "" &&
            selectedLanguage !== "" &&
            selectedGenre !== "" &&
            selectedArtStyle !== ""
        );
    };

    
    const toggleAside = () => {
      setIsAsideOpen(!isAsideOpen);
    };
  
    useEffect(() => {
        setIsFormValid(validateForm());
    }, [selectedAge, selectedLanguage, selectedGenre, selectedArtStyle]);


    const handleSubmit = async () => {
        if (customFilter.isProfane(storyPrompt)) {
            alert('Please remove any inappropriate language from your story prompt before submitting.');
            return;
        }
        setIsLoading(true);
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
        console.log(data)
    
        if (data.bookId) {
            router.push(`/${data.bookId}`);
        } else {
            console.error('Failed to generate book');
        }
        setIsLoading(false);
    }

    const genreImages = {
        'Adventure': '/images/adventure.webp', 
        'Fantasy': '/images/fantasy.webp', 
        'Mystery': '/images/mystery.webp', 
        'Action/Super-hero': '/images/action.webp' 
      };
    
    const artStyleImages = {
        'Water Color': '/images/watercolor.webp', 
        'Comic Book': '/images/comic.webp', 
        'Pixel Art': '/images/pixel.webp', 
        'Cartoon': '/images/cartoon.webp' 
    };

    return(
        <>
        <div className="flex h-screen bg-gray-100 ">
            <AsideComponent isOpen={isAsideOpen} toggleAside={toggleAside} />

            <div className="flex-1 bg-gradient-to-r from-neutral to-base-100 p-8">
                <main className= {`flex-1 bg-gradient-to-r from-neutral to-base-100 p-8 transition-all duration-300 ${
                    isAsideOpen ? 'ml-64' : 'ml-0'
                }`}>
                    <section className="mb-4">
                        <h2 className="font-semibold mb-2">Create Your Own Story</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-1">Choose your age</label>
                                <div className="flex gap-2">
                                    {['6', '7', '8', '9', '10'].map((age) => (
                                        <button
                                            key={age}
                                            className={`border-2 border-black w-12 h-12 btn btn-outline btn-secondary ${selectedAge === age ? styles.selected : ''}`}
                                            onClick={() =>setSelectedAge(age)}
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
                                            className={`border-2 border-black px-4 py-2 btn btn-outline btn-secondary ${selectedLanguage === language ? styles.selected : ''}`}
                                            onClick={() => setSelectedLanguage(language)}
                                        >
                                            {language}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1">Give us a glimpse into your story</label>
                                <textarea className="border-2 border-black w-full h-24 p-2" placeholder="For eg. This story is about a boy named Esh, he's a wizard and doesn't know" value = {storyPrompt} 
                                    // onChange={(e) => {
                                    //     const newPrompt = e.target.value;
                                    //     if (newPrompt.length <= 200) {
                                    //         setStoryPrompt(newPrompt);
                                    //     }
                                    //     setStoryPrompt(newPrompt.slice(0, 200));
                                    // }}       
                                    onChange={handleChange}
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
                                    className={`${styles['genre-art-style']} border-2 border-black  p-4 text-center ${selectedGenre === genre ? styles.selected : ''}`}
                                    onClick={() => setSelectedGenre(genre)}
                                >
                                    <Image 
                                        src={genreImages[genre as keyof typeof genreImages]} 
                                        alt={`Placeholder image for ${genre} genre`} 
                                        width={100}
                                        height={100}
                                    />
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </section>
                    <section className="mb-4">
                        <h2 className="font-semibold mb-2">Pick an art-style</h2>
                        <div className="grid grid-cols-4 gap-4">
                            {['Water Color', 'Comic Book', 'Pixel Art', 'Cartoon'].map((artStyle) => (
                                <button
                                    key={artStyle}
                                    className={`${styles['genre-art-style']} border-2 border-black p-4 text-center ${selectedArtStyle === artStyle ? styles.selected : ''}`}
                                    onClick={() => setSelectedArtStyle(artStyle)}
                                >
                                    <Image
                                        src={artStyleImages[artStyle as keyof typeof artStyleImages]} 
                                        alt={`Placeholder image for ${artStyle} art style`} 
                                        width={100}
                                        height={100}
                                     />
                                    {artStyle}
                                </button>
                            ))}
                        </div>
                    </section>
                    <div className="text-center">
                        <button
                            className={styles.submitButton}
                            onClick={handleSubmit}
                            disabled={!isFormValid || isLoading}
                        >
                            MAKE MY STORY
                        </button>
                        <LoadingOverlay isLoading={isLoading} />
                    </div>
                </main>
            </div>
        </div>
        </>
    );
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getSession(context)
  
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


export default NewStoryComponent;