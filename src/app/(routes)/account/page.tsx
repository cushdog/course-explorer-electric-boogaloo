'use client';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function AccountPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleBack = () => {
    router.push('/');
  }

  return (
    <div className="p-4">
      <Button onClick={handleBack}>Back</Button>
      <h1 className="text-2xl font-bold">Account Information</h1>
      <p>Email: {user.email}</p>
      <p>Name: {user.name}</p>
      <h2 className="text-xl font-bold mt-4">Favorited Classes</h2>
      <ul>
        <li>Class 1</li>
        <li>Class 2</li>
        <li>Class 3</li>
      </ul>
    </div>
  );
}