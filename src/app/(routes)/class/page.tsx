'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

type ClassDataType = (string | number | null)[];
type ClassDataListType = ClassDataType[];

const ClassContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classParam = searchParams.get('class');
  const [classData, setClassData] = useState<ClassDataType | ClassDataListType | null>(null);
  const [files, setFiles] = useState<{ key: string; url: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const { user } = useUser();

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
      checkIfFavorited();
    }
  }, [classParam]);

  const checkIfFavorited = async () => {
    if (!user) return;
  
    try {
      const url = `/api/user/${encodeURIComponent(user.email)}`;
      console.log("Fetching URL:", url);
      const response = await fetch(url);
      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch user data: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      console.log("Received data:", data);
      setIsFavorited(data.favoritedClasses.includes(classParam));
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) return;

    try {
      const method = isFavorited ? 'DELETE' : 'POST';
      const response = await fetch(`/api/favoriteClass`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.email, classId: classParam }),
      });


      if (!response.ok) {
        throw new Error(`Failed to ${isFavorited ? 'unfavorite' : 'favorite'} class`);
      }

      const data = await response.json();
      setIsFavorited(!isFavorited);
      console.log(`Class ${isFavorited ? 'unfavorited' : 'favorited'}:`, data);
    } catch (error) {
      console.error(`Error ${isFavorited ? 'unfavoriting' : 'favoriting'} class:`, error);
    }
  };

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
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
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
      {classData && (
        <Card style={{ backgroundColor: '#ABD1B5' }}>
          <CardHeader>
            <CardTitle style={{ color: '#8E6C88' }}>{classData[4] + ' ' + String(classData[5])}</CardTitle>
            <CardDescription style={{ color: '#8E6C88' }}>{classData[2] + ' ' + String(classData[1])}</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ color: '#8E6C88' }}>{classData[7]}</p>
          </CardContent>
          <CardFooter>
            <p style={{ color: '#8E6C88' }}>Credit Hours: {classData[8]}</p>
            <Button onClick={handleFavoriteToggle} className="ml-4 flex items-center">
              {isFavorited ? <MdFavorite size={24} color="red" /> : <MdFavoriteBorder size={24} />}
            </Button>
          </CardFooter>
        </Card>
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
              <Button onClick={() => handleFilePreview(file.key)}>{file.key.split('/').pop()}</Button>
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
