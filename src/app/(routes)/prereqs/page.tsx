'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PreReqs() {
    
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  }

  return (
    <>
      <Button onClick={handleBack}>Back</Button>
      <p>pre reqs</p>
    </>
  );
}