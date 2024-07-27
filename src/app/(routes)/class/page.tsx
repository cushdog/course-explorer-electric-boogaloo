'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const ClassPage = () => {

  const router = useRouter();
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('classData') as string);
    setClassData(data);
  }, []);

  useEffect(() => {
    if (classData !== null) {
      sessionStorage.removeItem('classData');
    }
  }, [classData]);

  const handleBack = () => {
    router.push('/');
  }

  return (
    <div>
      <Button onClick={handleBack}>Back</Button>
      <h1>Class Page</h1>
      <pre>{JSON.stringify(classData, null, 2)}</pre>
    </div>
  );
};

export default ClassPage;