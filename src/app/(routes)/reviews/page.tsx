'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Reviews() {

  const router = useRouter();
  
  const handleBack = () => {
    router.push('/');
  }

  return (
    <>
      <Button onClick={handleBack}>Back</Button>
      <p>reviews</p>
    </>
  );

}