import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../app/api/auth/[...nextauth]/route';
import { useState } from 'react';
import { User } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';

interface SettingsProps {
  user: User;
}

const settingsSchema = z.object({
    email: z.string().email('Invalid email').nonempty('Email is required'),
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
        <div>
        <h1>Settings</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <div>
            <label htmlFor="password">New Password:</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <button type="submit">Save Changes</button>
        </form>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) {
        return {
        redirect: {
            destination: '/auth/login',
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