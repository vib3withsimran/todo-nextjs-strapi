"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/utils/api'
import Link from 'next/link'

export default function Signin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const data = await loginUser(identifier, password);

    if (data.jwt) {
      localStorage.setItem('token', data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
      document.cookie = `token=${data.jwt}; path=/; max-age=3600;`;
      router.push('/');
    } else {
      setError(data.error?.message || 'Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center py-12 px-4 font-sans selection:bg-indigo-500/30">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-5xl text-center font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">
          Sign In
        </h1>
        
        <div className="bg-zinc-900 border border-zinc-800 shadow-sm rounded-xl p-8">
          {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input 
              type="text" 
              placeholder="Username or Email" 
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-zinc-100 placeholder-zinc-500 shadow-sm" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-zinc-100 placeholder-zinc-500 shadow-sm" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={6} 
            />
            
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium shadow-md shadow-indigo-500/10 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-indigo-600">
              Sign In
            </button>
          </form>
          
          <p className="mt-6 text-center text-zinc-400 text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}