import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/route';
import { useState } from 'react';
import { User } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faPen, faBook, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import "../app/globals.css";



interface SettingsProps {
  user: User;
}

const settingsSchema = z.object({
    email: z.string().email('Invalid email').min(1),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;


export default function Settings({ user }: SettingsProps) {
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<SettingsFormData>({
      resolver: zodResolver(settingsSchema),
      defaultValues: {
        email: user.email,
      },
    });

    const onSubmit = async (data: SettingsFormData) => {
        setSubmitting(true);
        try {
            const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            });
        
            if (response.ok) {
                alert('Settings updated');
            } else {
                alert('Failed to update settings');
            }
        }catch(error){
            console.error('An unexpected error happened:', error);
        }
        setSubmitting(false);
    };

    return (
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
                        {/* I have to next.link to the pages */}
                        <Link href="/settings"/>
                    </div>
                </div>
            </aside>
            <main className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-lg">
                    <h1 className="text-xl font-bold mb-8">Settings</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 border border-gray-300 rounded-lg">
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 p-3 border border-gray-300 rounded w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password:</label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 p-3 border border-gray-300 rounded w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="py-3 px-6 bg-blue-500 text-white font-medium rounded hover:bg-blue-700 w-full">Save Changes</button>
                    </form>
                </div>
            </main>
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

    const user = await prisma.user.findUnique({
        where: {
        email: session.user?.email || '',
        },
    });

    if (user){
        const serializedUser = {
            ...user,
            registrationDate: user.registrationDate.toISOString(),
        };

        return {
            props: {
            user: serializedUser,
            },
        };
    }

    return {
        notFound: true,
    };
}