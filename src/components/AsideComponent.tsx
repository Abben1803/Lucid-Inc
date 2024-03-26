import { faPen, faBook, faCog, faSignOutAlt, faGlobe, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useSession } from "next-auth/react"






const AsideComponent = () => {
    const { data: session} = useSession();

    const email = session?.user?.email;
    const firstPart = email?.match?.(/[^@]+/)?.[0];

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };
    return (
        <aside className="w-64 bg-base-100 p-6 border-r border-base-300 h-screen">
            <div className="mb-8">
                <div className="text-2xl font-bold mb-6 overflow-wrap break-words">Hello {firstPart}</div>
                <div className="flex items-center mb-4 cursor-pointer">
                    <FontAwesomeIcon icon={faHome} className="text-base-content mr-2"/>
                    <span>
                        <Link href="/dashboard">Home</Link>
                    </span>
                </div>
                <div className="flex items-center mb-4 cursor-pointer">
                    <FontAwesomeIcon icon={faPen} className="text-base-content mr-2"/>
                    <span>
                        <Link href="/newstory">New Story</Link>
                    </span>
                </div>
                <div className="flex items-center mb-4 cursor-pointer">
                    <FontAwesomeIcon icon={faBook} className="text-base-content mr-2"/>
                    <span>
                        <Link href="/mystories">My Stories</Link>
                    </span>
                </div>
                <div className="flex items-center mb-4 cursor-pointer">
                    <FontAwesomeIcon icon={faGlobe} className="text-base-content mr-2"/>
                    <span>
                        <Link href="/about">About Us</Link>
                    </span>
                </div>
            </div>
            <div className="mb-8 ">
                <div className="flex items-center mb-4 cursor-pointer">
                    <FontAwesomeIcon icon={faCog} className="text-base-content mr-2"/>
                    <span>
                        <Link href="/settings">Settings</Link>
                    </span>
                </div>
                <div className="flex items-center cursor-pointer" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-base-content mr-2"/>
                    <span>Log out</span>
                </div>
            </div>
        </aside>
    );
};

export default AsideComponent;