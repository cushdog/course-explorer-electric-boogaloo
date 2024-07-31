'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

type ClassDataType = (string | number | null)[];
type ClassDataListType = ClassDataType[];

const ClassPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classParam = searchParams.get('class');
  const [classData, setClassData] = useState<ClassDataType | ClassDataListType | null>(null);

  useEffect(() => {
    if (classParam) {
      fetch(`https://uiuc-course-api-production.up.railway.app/search?query=${classParam}`)
        .then((response) => response.json())
        .then((data) => {
          setClassData(data);
        })
        .catch((error) => console.error('Error fetching class data:', error));
    }
  }, [classParam]);

  const handleBack = () => {
    router.push('/');
  }

  return (
    <div>
      <Button onClick={handleBack}>Back</Button>
      <h1>Class Page</h1>
      {classData && !Array.isArray(classData[0]) ? (
        <>
          <p>Title: {classData[4] + " " + String(classData[5])}</p>
          <p>Semester: {classData[2] + " " + String(classData[1])}</p>
          <p>Name: {classData[6]}</p>
          <p>Description: {classData[7]}</p>
          <p>Credit Hours: {classData[8]}</p>
          <p>Info: {classData[9]}</p>
          <p>Average GPA: {classData[classData.length - 1]}</p>
        </>
      ) : (
        classData && (classData as ClassDataListType).map((classItem, index) => (
          <div key={index}>
            <p>Title: {classItem[4] + " " + String(classItem[5])}</p>
            <p>Description: {classItem[7]}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ClassPage;