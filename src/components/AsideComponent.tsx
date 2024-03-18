import { faPen, faBook, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const AsideComponent = () => {
    return (
        <aside className="w-64 bg-white p-6 border-r border-gray-300 h-screen">
            <div className="mb-8">
                <div className="text-2xl font-bold mb-6">M.U.S.</div>
                <div className="flex items-center mb-4 cursor-pointer">
                    <FontAwesomeIcon icon={faPen} className="text-gray-600 mr-2"/>
                    <span>
                    <Link href="/newstory">New Story</Link>
                    </span>
                </div>
                <div className="flex items-center mb-4 cursor-pointer">
                    <FontAwesomeIcon icon={faBook} className="text-gray-600 mr-2"/>
                    <span>My Stories</span>
                </div>
            </div>
            <div className="mb-8">
                <div className="flex items-center mb-4 cursor-pointer">
                    <FontAwesomeIcon icon ={faCog} className="text-gray-600 mr-2"/>
                    <span>
                        <Link href= "/settings">Settings</Link>
                    </span>
                </div>
                <div className="flex items-center cursor-pointer">
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-gray-600 mr-2"/>
                    <span>Log out</span>
                </div>
            </div>
        </aside>
    );
};

export default AsideComponent;