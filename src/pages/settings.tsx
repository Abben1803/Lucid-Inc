import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/route';
import { useState } from 'react';
import { User } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import "../app/globals.css";
import AsideComponent from '@/components/AsideComponent';



interface SettingsProps {
  user: User;
}

const settingsSchema = z.object({
    email: z.string().email('Invalid email').min(1),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    }) 
    .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match',
});

type SettingsFormData = z.infer<typeof settingsSchema>;


export default function Settings({ user }: SettingsProps) {
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const {
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
            <AsideComponent/>
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
                            <label htmlFor="confirm password" className = "blocktext-sm font-medium text-gray-700">Confirm Password:</label>
                            <input 
                                type="confirm password"
                                id = "confirm password"
                                className = "mt-1 p-3 border border-gray-300 rounded w-full"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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