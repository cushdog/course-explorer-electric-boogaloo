'use client';

import AdjustedSelect from "../../components/ui/adjusted_select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdjustedDropDown } from '../../components/ui/adjusted_dropdown';

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const semesterConfigs = [
    { semester: "Spring", year: "2024" },
    { semester: "Fall", year: "2023" },
    { semester: "Spring", year: "2023" },
    { semester: "Fall", year: "2022" },
  ];

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
          sessionStorage.setItem('classData', JSON.stringify(returned_data));
          router.push('/class');
        }
      })
      .catch(error => console.error('Error fetching data:', error)); // Added error handling
  }

  const fetchCoursesDate = (searchQuery: string, semester: string, year: string) => {
    const modified_search = `${searchQuery} ${selectedSemester} ${selectedYear}`;
    console.log(`Fetching with date: ${modified_search}`); // Added logging
    fetch(`https://uiuc-course-api-production.up.railway.app/search?query=${modified_search}`)
      .then(response => response.json())
      .then(returned_data => {
        sessionStorage.setItem('myKey', 'myValue');
        sessionStorage.setItem('classData', JSON.stringify(returned_data));
        console.log('Data fetched successfully:', returned_data); // Added logging
        router.push('/class');
      })
      .catch(error => console.error('Error fetching data:', error)); // Added error handling
  }

  const conditionalSearch = () => {
    console.log('Search button clicked'); // Added logging
    if (selectedSemester === "" || selectedYear === "") {
      fetchCoursesNoDate(search);
    } else {
      fetchCoursesDate(search, selectedSemester, selectedYear);
    }
  }

  const semester_options = [
    { value: "Fall", label: "Fall" },
    { value: "Spring", label: "Spring" },
    { value: "Summer", label: "Summer" },
    { value: "Winter", label: "Winter" }
  ];

  const year_options = [
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" }
  ];

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-2xl p-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="col-span-4">
          <Input placeholder="Search for a class..." value={search} onChange={handleInputChange} />
        </div>
        <div className="col-span-2 sm:col-span-2">
          <AdjustedSelect
            onChange={setSelectedSemester}
            selectedValue={selectedSemester}
            item_to_select="Select a semester"
            options={semester_options}
          />
        </div>
        <div className="col-span-2 sm:col-span-2">
          <AdjustedSelect
            onChange={setSelectedYear}
            selectedValue={selectedYear}
            item_to_select="Select a year"
            options={year_options}
          />
        </div>
        <div className="col-span-4 flex justify-center">
          <Button onClick={conditionalSearch}>Search</Button>
        </div>
        <div className="col-span-4 flex justify-center">
          <AdjustedDropDown />
        </div>
      </div>
    </div>

  );
}
