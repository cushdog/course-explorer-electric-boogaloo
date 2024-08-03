'use client';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AccountPage() {
  const { user } = useUser();
  const router = useRouter();
  const [favoritedClasses, setFavoritedClasses] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchFavoritedClasses();
    }
  }, [user, router]);

  const fetchFavoritedClasses = async () => {
    try {
      const response = await fetch(`/api/user/${user?.email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch favorited classes');
      }
      const data = await response.json();
      setFavoritedClasses(data.favoritedClasses);
    } catch (error) {
      console.error('Error fetching favorited classes:', error);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleDelete = async (classId: string) => {
    try {
      const response = await fetch('/api/favoriteClass', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.email, classId }),
      });

      if (!response.ok) {
        throw new Error('Failed to unfavorite class');
      }

      // Refresh the list of favorited classes
      fetchFavoritedClasses();
    } catch (error) {
      console.error('Error unfavoriting class:', error);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <Button onClick={handleBack}>Back</Button>
      <h1 className="text-2xl font-bold">Account Information</h1>
      <p>Email: {user.email}</p>
      <p>Name: {user.name}</p>
      <h2 className="text-xl font-bold mt-4">Favorited Classes</h2>
      <ul className="space-y-2">
        {favoritedClasses.map((classId) => (
          <li key={classId} className="flex items-center space-x-2">
            <span>{classId}</span>
            <Link href={`/class?class=${encodeURIComponent(classId)}`}>
              <Button variant="outline" size="sm">View</Button>
            </Link>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleDelete(classId)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}