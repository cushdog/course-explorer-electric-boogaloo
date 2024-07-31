'use client';

import AdjustedSelect from "../../components/ui/adjusted_select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdjustedDropDown } from '../../components/ui/adjusted_dropdown';
import UserDialog from "../../components/ui/account_dialog";
import { useUser } from "@/context/UserContext";

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const { user, setUser } = useUser();

  const semesterConfigs = [
    { semester: "Spring", year: "2024" },
    { semester: "Fall", year: "2023" },
    { semester: "Spring", year: "2023" },
    { semester: "Fall", year: "2022" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toUpperCase());
  };

  const handleLoginButtonClick = () => {
    router.push('/login');
  };

  const handleRegisterButtonClick = () => {
    router.push('/register');
  };

  const handleLogoutButtonClick = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload();
  };

  const fetchCoursesNoDate = (searchQuery: string, configIndex: number = 0) => {
    if (configIndex >= semesterConfigs.length) {
      console.log("All configurations tried, course not found");
      return;
    }

    searchQuery = searchQuery.replace(/([a-zA-Z])(\d)/, '$1 $2');

    const { semester, year } = semesterConfigs[configIndex];
    const modified_search = `${searchQuery} ${semester} ${year}`;
    console.log(`Fetching without date: ${modified_search}`);

    fetch(`https://uiuc-course-api-production.up.railway.app/search?query=${modified_search}`)
      .then(response => response.json())
      .then(returned_data => {
        if (returned_data === "Course not found") {
          fetchCoursesNoDate(searchQuery, configIndex + 1);
        } else {
          sessionStorage.setItem('classData', JSON.stringify(returned_data));
          router.push(`/class?class=${searchQuery}`);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const fetchCoursesDate = (searchQuery: string, semester: string, year: string) => {
    const modified_search = `${searchQuery} ${selectedSemester} ${selectedYear}`;
    console.log(`Fetching with date: ${modified_search}`);
    fetch(`https://uiuc-course-api-production.up.railway.app/search?query=${modified_search}`)
      .then(response => response.json())
      .then(returned_data => {
        sessionStorage.setItem('myKey', 'myValue');
        sessionStorage.setItem('classData', JSON.stringify(returned_data));
        console.log('Data fetched successfully:', returned_data);
        router.push(`/class?class=${searchQuery}`);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const conditionalSearch = () => {
    console.log('Search button clicked');
    if (selectedSemester === "" || selectedYear === "") {
      fetchCoursesNoDate(search);
    } else {
      fetchCoursesDate(search, selectedSemester, selectedYear);
    }
  };

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
    <div className="relative flex justify-center items-center h-screen">
      <UserDialog />
      <Button onClick={handleRegisterButtonClick} className="absolute top-4 left-4">Register</Button>
      {user ? (
        <Button onClick={handleLogoutButtonClick} className="absolute top-4 right-4">Logout</Button>
      ) : (
        <Button onClick={handleLoginButtonClick} className="absolute top-4 right-4">Login</Button>
      )}
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
