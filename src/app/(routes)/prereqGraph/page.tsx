'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Graph } from 'react-d3-graph';
import { Button } from '@/components/ui/button';

type ClassDataType = (string | number | null)[];
type PrerequisiteGroup = string[];
type CoursePrerequisites = PrerequisiteGroup[];

interface ParsedCourse {
  code: string;
  prerequisites: CoursePrerequisites;
  description: string;
}

export default function PrereqGraph() {
  const [prereqData, setPrereqData] = useState<ClassDataType | null>(null);
  const [parsedCourse, setParsedCourse] = useState<ParsedCourse | null>(null);
  const [paths, setPaths] = useState<string[][]>([]);
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] } | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('prereqData') as string) as ClassDataType;
    setPrereqData(data);
  }, []);

  useEffect(() => {
    if (prereqData) {
      try {
        const parsed = parseCourse(prereqData);
        setParsedCourse(parsed);
        generatePaths(parsed.code).then(({ paths: generatedPaths, descriptions }) => {
          const uniquePaths = removeDuplicatePaths(generatedPaths);
          setPaths(uniquePaths);
          const graph = transformToGraphData(uniquePaths, descriptions);
          setGraphData(graph);
        });
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    }
  }, [prereqData]);

  const parseCourse = (courseData: ClassDataType): ParsedCourse => {
    const code = `${courseData[4]} ${courseData[5]}`;
    const description = courseData[9] as string;
    const prerequisites = parsePrerequisites(description);
    return { code, prerequisites, description };
  };

  const parsePrerequisites = (description: string): string[][] => {
    const prereqMatch = description.match(/Prerequisite:\s*(.*?)(?=\.\s|$)/);
    if (!prereqMatch) return [];

    return prereqMatch[1].split(';')
      .map(group => group.trim()
        .replace(/^one of|^[.,\s]+|[.,\s]+$/g, '')
        .split(/,|\bor\b/i)
        .map(course => course.trim())
        .filter(course => /^[A-Z]+\s+\d+$/.test(course)))
      .filter(group => group.length > 0);
  };

  const semesterConfigs = [
    { semester: "Spring", year: "2024" },
    { semester: "Fall", year: "2023" },
    { semester: "Spring", year: "2023" },
    { semester: "Fall", year: "2022" },
  ];

  const fetchDescription = async (searchQuery: string, configIndex: number = 0): Promise<string> => {
    if (configIndex >= semesterConfigs.length) {
      console.log("All configurations tried, course not found");
      return 'Description not available';
    }

    searchQuery = searchQuery.replace(/([a-zA-Z])(\d)/, '$1 $2');

    const { semester, year } = semesterConfigs[configIndex];
    const modified_search = `${searchQuery} ${semester} ${year}`;
    console.log(`Fetching without date: ${modified_search}`);

    try {
      const response = await fetch(`https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(modified_search)}`);
      const returned_data = await response.json();

      if (returned_data === "Course not found") {
        return fetchDescription(searchQuery, configIndex + 1);
      } else {
        console.log("Returned data: ", returned_data);
        return returned_data[7];
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return 'Description not available';
    }
  };

  const fetchCoursePrerequisites = async (courseCode: string): Promise<CoursePrerequisites> => {
    const response = await fetch(`/api/coursePrerequisites?courseCode=${courseCode}`);
    const data = await response.json();
    if (data.prerequisites) {
      return data.prerequisites.filter((group: PrerequisiteGroup) => group.some(course => /^[A-Z]+\s+\d+$/.test(course)));
    } else {
      console.error(`Failed to fetch prerequisites for ${courseCode}: ${data.error}`);
      return [];
    }
  };

  const removeDuplicatePaths = (paths: string[][]) => {
    const uniquePaths = new Set(paths.map(path => path.join(' → ')));
    return Array.from(uniquePaths).map(path => path.split(' → '));
  };

  const generatePaths = async (
    courseCode: string,
    currentPath: string[] = [],
    allPaths: string[][] = [],
    visited: Set<string> = new Set(),
    descriptions: Map<string, string> = new Map()
  ): Promise<{ paths: string[][], descriptions: Map<string, string> }> => {
    if (visited.has(courseCode)) {
      return { paths: allPaths, descriptions };
    }
  
    visited.add(courseCode);
    currentPath.unshift(courseCode);
  
    const prerequisites = await fetchCoursePrerequisites(courseCode);
    const description = await fetchDescription(courseCode);
    descriptions.set(courseCode, description);
  
    if (prerequisites.length === 0) {
      allPaths.push([...currentPath]);
      return { paths: allPaths, descriptions };
    }
  
    for (const group of prerequisites) {
      const validPrereqs = group.filter(prereq => /^[A-Z]+\s+\d+$/.test(prereq));
      if (validPrereqs.length === 0) continue;
  
      const groupPaths: string[][] = [];
      for (const prereq of validPrereqs) {
        const result = await generatePaths(prereq, [...currentPath], [], new Set(visited), descriptions);
        groupPaths.push(...result.paths);
        descriptions = result.descriptions;
      }
  
      if (groupPaths.length > 0) {
        allPaths.push(...groupPaths);
      }
    }
  
    return { paths: allPaths, descriptions };
  };

  const transformToGraphData = (paths: string[][], descriptions: Map<string, string>) => {
    const nodes: Map<string, any> = new Map();
    const links: { source: string; target: string }[] = [];

    paths.forEach(path => {
      path.forEach((node, index) => {
        if (!nodes.has(node)) {
          const description = descriptions.get(node) || 'Description not available';
          nodes.set(node, { id: node, name: `Course ${node}`, description: `Description: ${description}` });
        }
        if (index > 0) {
          links.push({ source: path[index - 1], target: node });
        }
      });
    });

    return {
      nodes: Array.from(nodes.values()),
      links
    };
  };

  const graphConfig = {
    nodeHighlightBehavior: true,
    node: {
      color: 'lightblue',
      size: 300,
      fontSize: 12,
    },
    link: {
      highlightColor: 'blue',
    },
    directed: true,
    height: 600,
    width: 800,
    d3: {
      alphaTarget: 0.05,
      gravity: -400,
      linkLength: 300,
      linkStrength: 1,
    },
  };

  const handleNodeHover = (nodeId: string) => {
    setHoveredNode(nodeId);
  };

  const handleNodeClick = (nodeId: string) => {
    router.push(`/class?class=${encodeURIComponent(nodeId)}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Button onClick={() => router.push('/prereqs')} className="mb-4">
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-4">Prerequisite Graph</h1>
      {parsedCourse && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{parsedCourse.code}</h2>
          <p>{parsedCourse.description}</p>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-2">Prerequisite Paths:</h2>
      <ul className="mb-4">
        {paths.map((path, index) => (
          <li key={index}>{path.join(" → ")}</li>
        ))}
      </ul>
      {graphData && (
        <div className="border rounded p-4 relative">
          <Graph
            id="prereq-graph"
            data={graphData}
            config={graphConfig}
            onMouseOverNode={handleNodeHover}
            onMouseOutNode={() => setHoveredNode(null)}
            onClickNode={handleNodeClick}
          />
          {hoveredNode && (
            <div
              className="absolute bg-white border rounded p-2 shadow-lg"
              style={{
                top: '10px',
                right: '10px',
                maxWidth: '200px',
              }}
            >
              <h3 className="font-bold">{hoveredNode}</h3>
              <p>{graphData.nodes.find(node => node.id === hoveredNode)?.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
