import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCog} from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css';
import Link from 'next/link';


export default function Home(){


  return (
    <div className="flex h-screen bg-gray-100">
        <div className="m-auto bg-white p-12 shadow-lg rounded-lg flex" style={{ width: '90%' }}>
            <div className="flex flex-col justify-center items-start border-r border-gray-300 pr-12" style={{ width: '50%' }}>
                <div className="flex items-center mb-8">
                    
                    <FontAwesomeIcon icon={faBook}className="fas fa-book text-gray-700 mr-3"/>
                    <span className="text-gray-700 font-semibold text-lg">My Story Books</span>
                </div>
                <h1 className="text-5xl font-bold mb-4 text-gray-800">Discover Your Imagination</h1>
                <p className="text-gray-600 mb-8">
                    Explore the magical world of storytelling, create your
                    own unique stories & share them with friends and family.
                </p>
                {/* <button className="bg-black text-white px-8 py-3 rounded shadow mb-4">Login</button> */}
                <Link href="/login" className="bg-transparent border border-black text-black px-8 py-3 rounded shadow">Log In</Link>
            </div>
            <div className="pl-12" style={{ width: '50%' }}>
                <div className="border border-gray-300">
                    <img src="https://placehold.co/600x600" alt="Placeholder image representing a book cover" className="w-full" />
                </div>
            </div>
        </div>
    </div>
  );

}
