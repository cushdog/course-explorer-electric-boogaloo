'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AdjustedSelect from "../../../../components/ui/adjusted_select";
import AdjustedDropDown from "../../../../components/ui/adjusted_dropdown";

export default function PreReqs() {

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
    setSearch(e.target.value.toUpperCase());
  }

  const fetchCoursesNoDate = (searchQuery: string, configIndex: number = 0) => {
    if (configIndex >= semesterConfigs.length) {
      console.log("All configurations tried, course not found");
      return;
    }
    
    searchQuery = searchQuery.replace(/([a-zA-Z])(\d)/, '$1 $2');

    const { semester, year } = semesterConfigs[configIndex];
    const modified_search = `${searchQuery} ${semester} ${year}`;
    console.log(`Fetching without date: ${modified_search}`); // Added logging

    fetch(`https://uiuc-course-api-production.up.railway.app/search?query=${modified_search}`)
      .then(response => response.json())
      .then(returned_data => {
        if (returned_data === "Course not found") {
          fetchCoursesNoDate(searchQuery, configIndex + 1);
        } else {
          console.log(returned_data)
          sessionStorage.setItem('prereqData', JSON.stringify(returned_data));
          router.push('/prereqGraph');
        }
      })
      .catch(error => console.error('Error fetching data:', error)); // Added error handling
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={handleBack}>Back</Button>
      <div className="w-full max-w-2xl p-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="col-span-4">
          <Input placeholder="Generate a prereq graph for..." value={search} onChange={handleInputChange} />
        </div>
        <div className="col-span-4 flex justify-center">
          <Button onClick={() => fetchCoursesNoDate(search)}>Search</Button>
        </div>
      </div>
    </div>
  );
}