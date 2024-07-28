'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RMP() {

  const [search, setSearch] = useState("");

  const semesterConfigs = [
    { semester: "Spring", year: "2024" },
    { semester: "Fall", year: "2023" },
    { semester: "Spring", year: "2023" },
    { semester: "Fall", year: "2022" },
  ];
    
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const fetchProfInfo = (searchQuery: string) => {
    
    const modified_search = searchQuery;
    console.log(`Fetching without date: ${modified_search}`); // Added logging
    fetch(`https://rmp2-api.up.railway.app/search?query=${modified_search}`)
      .then(response => response.json())
      .then(returned_data => {
        
          console.log(returned_data)
          sessionStorage.setItem('professorReview', JSON.stringify(returned_data));
          router.push('/rmpPage');
        })
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={handleBack}>Back</Button>
      <div className="w-full max-w-2xl p-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="col-span-4">
          <Input placeholder="Search for a professor..." value={search} onChange={handleInputChange} />
        </div>
        <div className="col-span-4 flex justify-center">
          <Button onClick={() => fetchProfInfo(search)}>Search</Button>
        </div>
      </div>
    </div>
  );
}