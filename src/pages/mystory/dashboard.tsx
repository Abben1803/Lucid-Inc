import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faBook, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css';
import "../../app/globals.css";
import Link from 'next/link';

export default function dashboard(){

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
                </div>
            </div>
        </aside>
        <main className="flex-1 p-6">
            <div className="mb-8">
                <h1 className="text-xl font-semibold mb-4">Hello, young storyteller!</h1>
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="border border-gray-300 p-4 bg-white shadow-sm">
                            <div className="h-32 bg-gray-200"></div>
                            <div className="mt-2 text-center">Placeholder Title</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Your Bookmarked Tales</h2>
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <i className="fas fa-times text-gray-600 mr-2"></i>
                        <span>Placeholder Tale</span>
                    </div>
                ))}
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-4">Your Additional Tales</h2>
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <i className="fas fa-times text-gray-600 mr-2"></i>
                        <span>Placeholder Tale</span>
                    </div>
                ))}
            </div>
        </main>
    </div>
);

}