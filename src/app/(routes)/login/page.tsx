'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log(data);

    if (data.token) {
      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      
      // Set user data
      setUser({
        name: data.user.name,
        email: data.user.email,
        username: data.user.username,
      });

      router.push('/');
    } else {
      toast.error('Login failed!');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4" />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" />
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
}
