import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCog} from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css';
import Link from 'next/link';


export default function Home(){


    return (
        <div className="flex h-screen bg-base-200">
            <div className="m-auto bg-base-100 p-12 shadow-lg rounded-lg flex" style={{ width: '90%' }}>
                <div className="flex flex-col justify-center items-start border-r border-base-300 pr-12" style={{ width: '50%' }}>
                    <div className="flex items-center mb-8">
                        <FontAwesomeIcon icon={faBook} className="fas fa-book text-base-content mr-3" />
                        <span className="text-base-content font-semibold text-lg">My Story Books</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-4 text-base-content">Discover Your Imagination</h1>
                    <p className="text-base-content mb-8">
                        Explore the magical world of storytelling, create your
                        own unique stories & share them with friends and family.
                    </p>
                    <Link href="/login" className="btn btn-outline">Log In</Link>
                </div>
                <div className="pl-12" style={{ width: '50%' }}>
                    <div className="border border-base-300">
                        <img src="https://placehold.co/600x600" alt="Placeholder image representing a book cover" className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
    
}
