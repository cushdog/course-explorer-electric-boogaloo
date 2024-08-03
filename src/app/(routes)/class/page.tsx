'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

type ClassDataType = (string | number | null)[];
type ClassDataListType = ClassDataType[];

const ClassContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classParam = searchParams.get('class');
  const [classData, setClassData] = useState<ClassDataType | ClassDataListType | null>(null);
  const [files, setFiles] = useState<{ key: string; url: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const semesterConfigs = [
    { semester: 'Spring', year: '2024' },
    { semester: 'Fall', year: '2023' },
    { semester: 'Spring', year: '2023' },
    { semester: 'Fall', year: '2022' },
  ];

  useEffect(() => {
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

    fetch(`https://uiuc-course-api-production.up.railway.app/search?query=${modified_search}`)
      .then((response) => response.json())
      .then((data) => {
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
      const response = await fetch(`/api/files?classParam=${classParam}`);
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !classParam) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('classParam', classParam);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error uploading file');
      }

      const data = await response.json();
      console.log('File uploaded successfully:', data.url);
      fetchFiles(classParam);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileDelete = async (key: string) => {
    try {
      const response = await fetch(`/api/deleteFile`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error deleting file');
      }

      console.log('File deleted successfully');
      fetchFiles(classParam || '');
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const downloadFileFromUrl = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.setAttribute('href', url!);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleFileDownload = async (key: string) => {
    try {
      const response = await fetch(`/api/getPresignedUrl?key=${encodeURIComponent(key)}`);
      if (!response.ok) {
        throw new Error('Failed to get presigned URL');
      }
      const { url } = await response.json();
      const fileName = key.split('/').pop() || 'download';
      downloadFileFromUrl(url, fileName);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleFilePreview = async (key: string) => {
    try {
      const response = await fetch(`/api/getPresignedUrl?key=${encodeURIComponent(key)}`);
      if (!response.ok) {
        throw new Error('Failed to get presigned URL');
      }
      const { url } = await response.json();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error previewing file:', error);
    }
  };

  return (
    <div className="p-4">
      <Button onClick={handleBack} className="mb-4">Back</Button>
      <h1 className="text-2xl font-bold mb-4">Class Page</h1>
      {classData && !Array.isArray(classData[0]) ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-black font-bold">Title</TableHead>
              <TableHead className="text-black font-bold">Semester</TableHead>
              <TableHead className="text-black font-bold">Name</TableHead>
              <TableHead className="text-black font-bold">Description</TableHead>
              <TableHead className="text-black font-bold">Credit Hours</TableHead>
              <TableHead className="text-black font-bold">Info</TableHead>
              <TableHead className="text-black font-bold">Average GPA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">{classData[4]} {String(classData[5])}</TableCell>
              <TableCell>{classData[2]} {String(classData[1])}</TableCell>
              <TableCell>{classData[6]}</TableCell>
              <TableCell>{classData[7]}</TableCell>
              <TableCell>{classData[8]}</TableCell>
              <TableCell>{classData[9]}</TableCell>
              <TableCell>{classData[classData.length - 1]}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        classData && (classData as ClassDataListType).map((classItem, index) => (
          <Table key={index}>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-black font-bold">Title</TableHead>
                <TableHead className="text-black font-bold">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">{classItem[4]} {String(classItem[5])}</TableCell>
                <TableCell>{classItem[7]}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ))
      )}
      <div>
        <h2 className="text-xl font-semibold mb-2">Student Files</h2>
        <div className="mb-4">
          <input type="file" onChange={handleFileChange} className="mr-2" />
          <Button onClick={handleFileUpload} disabled={!selectedFile}>Upload</Button>
        </div>
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file.key} className="flex items-center space-x-2">
              <Button onClick={() => handleFilePreview(file.key)} className="text-blue-600 hover:underline">{file.key.split('/').pop()}</Button>
              <Button onClick={() => handleFileDelete(file.key)} className="bg-red-500 hover:bg-red-600 text-white">Delete</Button>
              <Button onClick={() => handleFileDownload(file.key)} className="bg-green-500 hover:bg-green-600 text-white">Download</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ClassPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClassContent />
    </Suspense>
  );
};

export default ClassPage;
