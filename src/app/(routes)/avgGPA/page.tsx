'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AvgGPA() {

  const router = useRouter();
  
  const handleBack = () => {
    router.push('/');
  }

  return (
    <>
      <Button onClick={handleBack}>Back</Button>
      <p>avgGPA</p>
    </>
  );
  
}