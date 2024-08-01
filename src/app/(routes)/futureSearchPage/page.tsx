'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// Define types
type CourseData = {
  0: number;  // id
  1: number;  // year
  2: string;  // term
  3: string;  // termCode
  4: string;  // subject
  5: number;  // number
  6: string;  // title
  7: string;  // description
  8: string;  // creditHours
  9: string;  // detailedInfo
  // ... other fields ...
  29: number | null;  // gpa
};

const FutureClassesPage: React.FC = () => {
  const [futureClasses, setFutureClasses] = useState<CourseData[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      try {
        const data = JSON.parse(sessionStorage.getItem('futureData') || '[]');
        if (!Array.isArray(data)) {
          throw new Error('Invalid data structure');
        }
        setFutureClasses(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching future classes data:', err);
        setError('Failed to load future classes data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const uniqueFutureClasses = useMemo(() => {
    const uniqueCoursesSet = new Set();
    return futureClasses.filter(course => {
      const courseKey = `${course[4]}${course[5]}`; // subject + number
      if (!uniqueCoursesSet.has(courseKey)) {
        uniqueCoursesSet.add(courseKey);
        return true;
      }
      return false;
    });
  }, [futureClasses]);

  const renderCourseCard = (course: CourseData) => (
    <div
      key={`${course[4]}${course[5]}`}
      className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => setSelectedCourse(course)}
    >
      <h2 className="text-xl font-semibold mb-2">{course[4]} {course[5]}</h2>
      <h3 className="text-lg mb-2">{course[6]}</h3>
      <p className="text-sm text-gray-600 mb-2">{course[8]}</p>
      <p className="text-sm text-gray-500 truncate">{course[7].substring(0, 100)}...</p>
    </div>
  );

  const renderCourseDetails = (course: CourseData) => (
    <div className="bg-white p-4 rounded-lg shadow-md sticky top-4">
      <h2 className="text-2xl font-semibold mb-2">{course[4]} {course[5]}</h2>
      <h3 className="text-xl mb-2">{course[6]}</h3>
      <p className="text-gray-600 mb-2">{course[8]}</p>
      <p className="text-gray-700 mb-4">{course[7]}</p>
      <p className="text-sm text-gray-600 mb-2">Term: {course[2]} {course[1]}</p>
      {course[29] !== null && (
        <p className="text-sm text-gray-600 mb-4">Average GPA: {course[29].toFixed(2)}</p>
      )}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        onClick={() => router.push(`/course/${course[0]}`)}
      >
        View Course Details
      </button>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading future classes...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (uniqueFutureClasses.length === 0) {
    return <div className="text-center py-8">No future classes available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Future Classes
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uniqueFutureClasses.map(renderCourseCard)}
          </div>
        </div>
        <div className="lg:col-span-1">
          {selectedCourse ? (
            renderCourseDetails(selectedCourse)
          ) : (
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              Select a course to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FutureClassesPage;