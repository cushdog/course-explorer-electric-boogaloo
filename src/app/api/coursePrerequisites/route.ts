// app/api/coursePrerequisites/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface SemesterConfig {
  semester: string;
  year: string;
}

const semesterConfigs: SemesterConfig[] = [
  { semester: "Spring", year: "2024" },
  { semester: "Fall", year: "2023" },
  { semester: "Spring", year: "2023" },
  { semester: "Fall", year: "2022" },
];

const parsePrerequisites = (description: string): string[][] => {
  const prereqMatch = description.match(/Prerequisite:\s*(.*?)(?=\.\s|$)/);
  if (!prereqMatch) return [];

  const prerequisitesText = prereqMatch[1];
  return prerequisitesText.split(';').map(group => {
    const trimmed = group.trim().replace(/^[.,\s]+|[.,\s]+$/g, ''); // Remove unnecessary punctuation
    if (/^one of/i.test(trimmed)) {
      return trimmed
        .replace(/^one of/i, '')
        .split(/,|\bor\b/i)
        .map(option => option.trim().replace(/^[.,\s]+|[.,\s]+$/g, '')) // Remove unnecessary punctuation
        .filter(s => /^[A-Z]+\s+\d+$/.test(s));
    } else if (/\bor\b/i.test(trimmed)) {
      return trimmed
        .split(/\bor\b/i)
        .map(option => option.trim().replace(/^[.,\s]+|[.,\s]+$/g, '')) // Remove unnecessary punctuation
        .filter(s => /^[A-Z]+\s+\d+$/.test(s));
    } else {
      return trimmed.split(',').map(s => s.trim().replace(/^[.,\s]+|[.,\s]+$/g, '')).filter(s => /^[A-Z]+\s+\d+$/.test(s)); // Remove unnecessary punctuation
    }
  }).filter(group => group.length > 0);
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let courseCode = searchParams.get('courseCode');

  console.log('Received courseCode:', courseCode);

  if (!courseCode) {
    console.error('Course code is required');
    return NextResponse.json({ error: 'Course code is required' }, { status: 400 });
  }

  // Clean up course code
  courseCode = courseCode.replace(/\.$/, '').trim();
  console.log('Cleaned courseCode:', courseCode);

  if (!/^[A-Z]+\s+\d+$/.test(courseCode)) {
    console.error('Invalid course code format');
    return NextResponse.json({ error: 'Invalid course code format' }, { status: 400 });
  }

  for (const { semester, year } of semesterConfigs) {
    try {
      const [subject, number] = courseCode.split(' ');
      const url = `https://courses.illinois.edu/cisapp/explorer/schedule/${year}/${semester}/${subject}/${number}.xml?mode=cascade`;
      console.log(`Fetching URL: ${url}`);

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Failed to fetch ${courseCode} for ${semester} ${year}: ${response.statusText}`);
        continue;
      }

      const text = await response.text();
      const description = text.match(/<description>(.*?)<\/description>/)?.[1] || '';
      console.log(`Fetched description: ${description}`);
      const prerequisites = parsePrerequisites(description);
      console.log(`Parsed prerequisites: ${JSON.stringify(prerequisites)}`);
      return NextResponse.json({ prerequisites }, { status: 200 });
    } catch (error) {
      console.error(`Error fetching ${courseCode} for ${semester} ${year}:`, error);
    }
  }

  console.error('Course not found for any semester/year combination');
  return NextResponse.json({ error: 'Course not found' }, { status: 404 });
}