"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/utils/api';
import Link from 'next/link';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    const data = await registerUser(username, email, password);
    
    if (data.jwt) {
      localStorage.setItem('token', data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
      document.cookie = `token=${data.jwt}; path=/; max-age=3600;`;
      router.push('/');
    } else {
      setError(data.error?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center py-12 px-4 font-sans selection:bg-indigo-500/30">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-5xl text-center font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">
          Sign Up
        </h1>
        
        <div className="bg-zinc-900 border border-zinc-800 shadow-sm rounded-xl p-8">
          {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" placeholder="Username" 
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-zinc-100 placeholder-zinc-500 shadow-sm" 
              value={username} onChange={(e) => setUsername(e.target.value)} required />
              
            <input type="email" placeholder="Email" 
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-zinc-100 placeholder-zinc-500 shadow-sm" 
              value={email} onChange={(e) => setEmail(e.target.value)} required />
              
            <input type="password" placeholder="Password (min 6 chars)" 
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-zinc-100 placeholder-zinc-500 shadow-sm" 
              value={password} onChange={(e) => setPassword(e.target.value)} required />
              
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium shadow-md shadow-indigo-500/10 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-indigo-600">
              Create Account
            </button>
          </form>
          
          <p className="mt-6 text-center text-zinc-400 text-sm">
            Already have an account?{' '}
            <Link href="/signin" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}