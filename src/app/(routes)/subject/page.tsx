'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type CourseData = [
  number, number, string, string, string, number, string, string, string, string,
  null, null, number, string, string, string, null, string, string, string,
  string, string, string, string, string, string, string, string, null, number
];

const semesterConfigs = [
  { semester: "Spring", year: "2024" },
  { semester: "Fall", year: "2023" },
  { semester: "Spring", year: "2023" },
  { semester: "Fall", year: "2022" },
];

const SubjectsPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      try {
        const rawData = JSON.parse(sessionStorage.getItem('subjectData') as string);
        if (rawData && Array.isArray(rawData)) {
          setCourses(rawData);
          setError(null);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (err) {
        console.error('Error fetching subjects data:', err);
        setError('Failed to load subjects data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchCoursesNoDate = (searchQuery: string, configIndex: number = 0) => {
    if (configIndex >= semesterConfigs.length) {
      console.log("All configurations tried, course or subject not found");
      setError('Course or subject not found');
      return;
    }
  
    const isSubjectSearch = !searchQuery.includes(' ');
  
    if (!isSubjectSearch) {
      searchQuery = searchQuery.replace(/([a-zA-Z])(\d)/, '$1 $2');
    }
  
    const { semester, year } = semesterConfigs[configIndex];
    const modified_search = `${searchQuery} ${semester} ${year}`;
    console.log(`Fetching without date: ${modified_search}`);
  
    fetch(`https://uiuc-course-api-production.up.railway.app/search?query=${modified_search}`)
      .then(response => response.json())
      .then(returned_data => {
        if (returned_data === "Course not found") {
          fetchCoursesNoDate(searchQuery, configIndex + 1);
        } else {
          if (isSubjectSearch) {
            sessionStorage.setItem('subjectData', JSON.stringify(returned_data));
            router.push(`/subject?subject=${searchQuery}`);
          } else {
            sessionStorage.setItem('classData', JSON.stringify(returned_data));
            router.push(`/class?class=${searchQuery}+${semester}+${year}`);
          }
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch course data. Please try again.');
      });
  };

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
        onClick={() => fetchCoursesNoDate(`${course[4]} ${course[5]}`)}
      >
        View Course Details
      </button>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading courses...</div>;
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

  if (courses.length === 0) {
    return <div className="text-center py-8">No courses available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Courses
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(renderCourseCard)}
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

export default SubjectsPage;