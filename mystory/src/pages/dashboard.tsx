import React, {useState, useRef, useEffect} from 'react'
import Image from 'next/image'
// store the prompt, story, images, and audio in prisma db
import { PrismaClient } from '@prisma/client'

export default function MyStoryPage(){
    const [prompt, setPrompt] = useState("");
    const [story, setStory] = useState([]);
    const [images, setImage] = useState([]);
    const [audio, setAudio] = useState("");
    const audioRef = useRef(null);
    const [title, setTitle] = useState("");
    const [currentPage, setCurrentPage] = useState(0);



    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "ArrowRight") {
                setCurrentPage((prev) => Math.min(prev + 1, story.length - 1));
            } else if (event.key === "ArrowLeft") {
                setCurrentPage((prev) => Math.max(prev - 1, 0));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [story.length]);

    useEffect(() => {
        if(audio && audioRef.current){
            (audioRef.current as HTMLAudioElement).play();
        }
    }, [audio]);

    const handleSumbit = async() => {
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        setStory(data.story || "");

        const titleResponse = await fetch('/api/titleGenerator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ story: data.title }),
        });

        const titleData = await titleResponse.json();
        setTitle(titleData.title);

        const imageResponse = await fetch('/api/stabilityAI', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ story: data.story }),
        });

        const imageData = await imageResponse.json();
        setImage(imageData.images);

        const audioResponse = await fetch('/api/elevenlab', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ story: data.story }),
        });

        const audioBlob = await audioResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudio(audioUrl);
    };

    return (
        <div>
            <h1>My Story</h1>
            <div>
                <button onClick={handleSumbit}>Submit</button>
            </div>
            {title.length > 0 && (
                <div>
                    <h2>Title</h2>
                    <p>{title}</p>
                </div>
            )}
            {story.length > 0 && currentPage <= story.length &&(
                <div>
                    <h2>Story</h2>
                    <p>{story[currentPage]}</p>
                </div>
            )}
            {images.length > 0 && currentPage < images.length && (
                <div className="bg-gray-200 rounded">
                    <Image
                        alt=""
                        width={512}
                        height={512}
                        src={`data:image/jpeg;base64,${images[currentPage]}`}
                    />
                </div>
            )}
            {audio && (
                <div>
                    <h2>Audio</h2>
                    <audio ref={audioRef} controls>
                        <source src={audio} type="audio/mpeg" />
                    </audio>
                </div>
            )}
        </div> 
    );
}