'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define the type for the professor data
interface ProfessorData {
  firstName: string;
  lastName: string;
  rating1: number;
  rating2: number;
}

export default function RmpPage() {
  const [professorData, setProfessorData] = useState<ProfessorData[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const rawData = JSON.parse(sessionStorage.getItem('professorReview') as string);
    if (rawData) {
      const data = rawData.map((prof: any[]) => ({
        firstName: prof[0],
        lastName: prof[1],
        rating1: prof[2],
        rating2: prof[3],
      })) as ProfessorData[];
      setProfessorData(data);
    }
  }, []);

  const handleBack = () => {
    router.push('/rmp');
  };

  return (
    <>
      <Button onClick={handleBack}>Back</Button>
      <h1>Professor Reviews</h1>
      {professorData ? (
        <ul>
          {professorData.map((prof, index) => (
            <li key={index}>
              {prof.firstName} {prof.lastName} - Overall Quality: {prof.rating1}, Level of Difficulty: {prof.rating2}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}
    </>
  );
}