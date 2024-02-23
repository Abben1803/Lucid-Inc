'use client'

import Link from 'next/link';


import { useRouter } from 'next/router';
import { useState, FormEvent } from 'react';

interface LoginResponse {
  message?: string;
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const response = await fetch('/api/auth/login', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          email, 
          password 
        }
      ),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message); 
      window.location.href = '/dashboard';
    } else {
      const data = await response.json();
      console.error(data.message);
      setError(data.message);
    }
  };
/*
  return (
    <div className="flex justify-center items-center h-screen bg-[#1A1A2E]">
      <div className="p-8 rounded-lg bg-[#252a41] flex flex-col items-center space-y-4">
        <h1 className="text-white">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="p-2 rounded-none rounded bg-white text-black border-none" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="p-2 rounded-none rounded bg-white text-black border-none" 
          />
          <button 
            type="submit" 
            disabled={loading} 
            className={`p-2 rounded-none rounded bg-[#4e0eff] text-white border-none mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-600">{error}</p>}
        <Link href="/pages/register">
          <span className="text-white no-underline hover:underline">Register</span>
        </Link>
        <Link href="/forgotPassword">
          <span className="text-white no-underline hover:underline">Forgot Password</span>
        </Link>
      </div>
    </div>


  );*/

  return(
    <div className="w-full max-w-xs">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
          id="email" 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
          id="password" 
          type="password" 
          placeholder="******************"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          >
            Sign In
          </button>
          <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/forgotpassword">
            Forgot Password?
          </a>
        </div>
        <div className = "flex items-center justify-between">
          <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/register">
            Register
          </a>
        </div>
      </form>

    </div>


  );
  
  
}
