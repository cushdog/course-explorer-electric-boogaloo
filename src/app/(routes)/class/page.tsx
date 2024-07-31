'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import axios from 'axios';

type ClassDataType = (string | number | null)[];
type ClassDataListType = ClassDataType[];

interface Section {
  id: number;
  courseNumber: string;
  subject: string;
  courseTitle: string;
  seatsAvailable: number;
  maximumEnrollment: number;
  enrollment: number;
}

const ClassPage = () => {
  const router = useRouter();
  const [classData, setClassData] = useState<ClassDataType | ClassDataListType | null>(null);
  // const [sectionsInfo, setSections] = useState([]);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('classData') as string) as ClassDataType | ClassDataListType;
    // console.log(data.length);
    setClassData(data);
  }, []);

  useEffect(() => {
    if (classData !== null) {
      // fetchClassData();
      sessionStorage.removeItem('classData');
    }
  }, [classData]);

  const handleBack = () => {
    router.push('/');
  }

  // const fetchClassData = () => {
  //   if (classData) {
  //     let search = classData[4] + " " + String(classData[5]);
  //     let url = `https://self-service-api-production.up.railway.app/search?query=${search}`;
  //     console.log(url)
  //     fetch(`https://self-service-api-production.up.railway.app/search?query=${search}`)
  //       .then(response => response.json())
  //       .then(returned_data => {
  //         console.log(returned_data)
  //         setSections(returned_data);
  //       })
  //       .catch(error => console.error('Error fetching data:', error));
  //   }
  // };

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
          
          {/* <p>Sections:</p> */}

          {/* {sectionsInfo.map((section, index) => (
            <div key={index}>
              <p>CRN: {section[0]}</p>
              <p>Available: {section[4]}</p>
              <p>Max: {section[5]}</p>
              <p>Currently Enrolled: {section[6]}</p>
              <br />
            </div>
          ))} */}

        </>
      ) : (
        classData && (classData as ClassDataListType).map((classItem, index) => (
          <div key={index}>
            <p>Title: {classItem[4] + " " + String(classItem[5])}</p>
            <p>Description: {classItem[7]}</p>
          </div>
        ))
      )}
      {/* <pre>{JSON.stringify(classData, null, 2)}</pre> */}
    </div>
  );
};

export default ClassPage;
