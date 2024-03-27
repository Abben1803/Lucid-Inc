import { faPen, faBook, faCog, faSignOutAlt, faGlobe, faHome, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useSession } from "next-auth/react";

interface AsideComponentProps {
    isOpen: boolean;
    toggleAside: () => void;
}

const AsideComponent = ({ isOpen, toggleAside }: AsideComponentProps) => {
    const { data: session } = useSession();
    const email = session?.user?.email;
    const firstPart = email?.match?.(/[^@]+/)?.[0];

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <>
            <button className="fixed top-4 left-4 z-10" onClick={toggleAside}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="2x" />
            </button>
            <aside
                className={`fixed top-0 left-0 w-64 bg-base-100 p-6 border-r border-base-300 h-screen transition-transform duration-300 ease-in-out transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="mt-8 text-2xl font-bold mb-6 overflow-wrap break-words">Hello {firstPart}</div>
                <div className="mb-8">
                    <div className="flex items-center mb-4 cursor-pointer hover:text-primary transition-colors duration-200">
                        <FontAwesomeIcon icon={faHome} className="text-base-content mr-2" />
                        <span>
                            <Link href="/dashboard">Home</Link>
                        </span>
                    </div>
                    <div className="flex items-center mb-4 cursor-pointer hover:text-primary transition-colors duration-200">
                        <FontAwesomeIcon icon={faPen} className="text-base-content mr-2" />
                        <span>
                            <Link href="/newstory">New Story</Link>
                        </span>
                    </div>
                    <div className="flex items-center mb-4 cursor-pointer hover:text-primary transition-colors duration-200">
                        <FontAwesomeIcon icon={faBook} className="text-base-content mr-2" />
                        <span>
                            <Link href="/mystories">My Stories</Link>
                        </span>
                    </div>
                    <div className="flex items-center mb-4 cursor-pointer hover:text-primary transition-colors duration-200">
                        <FontAwesomeIcon icon={faGlobe} className="text-base-content mr-2" />
                        <span>
                            <Link href="/about">About Us</Link>
                        </span>
                    </div>
                </div>
                <div className="mb-8">
                    <div className="flex items-center mb-4 cursor-pointer hover:text-primary transition-colors duration-200">
                        <FontAwesomeIcon icon={faCog} className="text-base-content mr-2" />
                        <span>
                            <Link href="/settings">Settings</Link>
                        </span>
                    </div>
                    <div className="flex items-center cursor-pointer hover:text-primary transition-colors duration-200" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-base-content mr-2" />
                        <span>Log out</span>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AsideComponent;