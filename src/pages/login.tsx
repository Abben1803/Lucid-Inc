
import React from 'react';
import "../app/globals.css";
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import Router from 'next/router';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
});


const signupSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    }) 
    .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match',
});


export default function RegisterPage() {
    const [isLogin, setIsLogin] = React.useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
    
        try {
            if (isLogin) {
                loginSchema.parse(data);
                // Use NextAuth.js's signIn for login
                const result = await signIn('credentials', {
                    redirect: false, // Prevent default redirect to avoid page reload
                    email: data.email,
                    password: data.password,
                });
                if(result?.ok){Router.push('/dashboard')}
                if (result?.error) {
                    throw new Error(result.error || 'Invalid credentials');
                }
            } else {
                signupSchema.parse(data);
                const signupResult = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if(signupResult.ok){toggleForm();}
                if (!signupResult.ok) throw new Error('Signup failed');
            }
    
            // alert('Form submission successful');
        } catch (error) {
            if (error instanceof Error) {
                alert(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black">
            <div className="p-8 bg-white shadow-md rounded-lg max-w-md w-full">
                {isLogin ? (
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
                        <input className="w-full p-2 border border-gray-300 rounded mb-4" type="email" name="email" placeholder="Email" aria-label="Email" required />
                        <input className="w-full p-2 border border-gray-300 rounded mb-4" type="password" name="password" placeholder="Password" aria-label="Password" required />
                        <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700" type="submit">Login</button>
                        <p className="text-center mt-4">Don't have an account? <button type="button" className="text-blue-500 hover:underline" onClick={toggleForm}>Sign up</button></p>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-center text-2xl font-bold mb-6">Signup</h2>
                        <input className="w-full p-2 border border-gray-300 rounded mb-4" type="email" name="email" placeholder="Email" aria-label="Email" required />
                        <input className="w-full p-2 border border-gray-300 rounded mb-4" type="password" name="password" placeholder="Password" aria-label="Password" required />
                        <input className="w-full p-2 border border-gray-300 rounded mb-4" type="password" name="confirmPassword" placeholder="Confirm Password" aria-label="Confirm Password" required />
                        <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700" type="submit">SignUp</button>
                        <p className="text-center mt-4">Already have an account? <button type="button" className="text-blue-500 hover:underline" onClick={toggleForm}>Login</button></p>
                    </form>
                )}
            </div>
        </div>
    );
}
