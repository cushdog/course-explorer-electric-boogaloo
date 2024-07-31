'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import axios from 'axios';

type ClassDataType = (string | number | null)[];
type ClassDataListType = ClassDataType[];

const ClassPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classParam = searchParams.get('class');
  const [classData, setClassData] = useState<ClassDataType | ClassDataListType | null>(null);
  const [files, setFiles] = useState<{ key: string; url: string }[]>([]);

  const semesterConfigs = [
    { semester: 'Spring', year: '2024' },
    { semester: 'Fall', year: '2023' },
    { semester: 'Spring', year: '2023' },
    { semester: 'Fall', year: '2022' },
  ];

  useEffect(() => {
    console.log('Query Parameters:', searchParams.toString());
    console.log('Class Parameter:', classParam);
    if (classParam) {
      fetchClassDataWithDates(classParam);
      fetchFiles(classParam);
    }
  }, [classParam]);

  const fetchClassDataWithDates = (classQuery: string, configIndex: number = 0) => {
    if (configIndex >= semesterConfigs.length) {
      console.log('All configurations tried, course not found');
      return;
    }

    const { semester, year } = semesterConfigs[configIndex];
    const modified_search = `${classQuery} ${semester} ${year}`;
    console.log(`Fetching: ${modified_search}`);

    fetch(`https://uiuc-course-api-production.up.railway.app/search?query=${modified_search}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched Class Data:', data);
        if (data === 'Course not found') {
          fetchClassDataWithDates(classQuery, configIndex + 1);
        } else {
          setClassData(data);
        }
      })
      .catch((error) => console.error('Error fetching class data:', error));
  };

  const fetchFiles = async (classParam: string) => {
    try {
      const response = await axios.get(`/api/files`, { params: { classParam } });
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('classParam', classParam || '');

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data.url);
      fetchFiles(classParam || '');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <Button onClick={handleBack}>Back</Button>
      <h1>Class Page</h1>
      {classData && !Array.isArray(classData[0]) ? (
        <>
          <p>Title: {classData[4] + ' ' + String(classData[5])}</p>
          <p>Semester: {classData[2] + ' ' + String(classData[1])}</p>
          <p>Name: {classData[6]}</p>
          <p>Description: {classData[7]}</p>
          <p>Credit Hours: {classData[8]}</p>
          <p>Info: {classData[9]}</p>
          <p>Average GPA: {classData[classData.length - 1]}</p>
        </>
      ) : (
        classData && (classData as ClassDataListType).map((classItem, index) => (
          <div key={index}>
            <p>Title: {classItem[4] + ' ' + String(classItem[5])}</p>
            <p>Description: {classItem[7]}</p>
          </div>
        ))
      )}
      <div>
        <h2>Student Files</h2>
        <input type="file" onChange={handleFileUpload} />
        <ul>
          {files.map((file) => (
            <li key={file.key}>
              <a href={file.url} target="_blank" rel="noopener noreferrer">{file.key}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClassPage;