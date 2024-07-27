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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toUpperCase());
  }

  const fetchCoursesNoDate = (searchQuery: string) => {
    let new_sem = "Spring";
    let new_year = "2024";
    const modified_search = `${searchQuery} ${new_sem} ${new_year}`;
    console.log(`Fetching without date: ${modified_search}`); // Added logging
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
    <>
      <Input placeholder="Search for a class..." value={search} onChange={handleInputChange} />
      <AdjustedDropDown />
      <AdjustedSelect onChange={setSelectedSemester} selectedValue={selectedSemester} item_to_select="Select a semester" options={semester_options} />
      <AdjustedSelect onChange={setSelectedYear} selectedValue={selectedYear} item_to_select="Select a year" options={year_options} />
      <Button onClick={conditionalSearch}>Search</Button>
    </>
  );
}
