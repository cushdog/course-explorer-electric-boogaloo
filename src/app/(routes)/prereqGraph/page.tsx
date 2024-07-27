'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Graph } from "react-d3-graph";

type ClassDataType = (string | number | null)[];

type PrerequisiteGroup = string[];
type CoursePrerequisites = PrerequisiteGroup[];

interface ParsedCourse {
  code: string;
  prerequisites: CoursePrerequisites;
}

export default function PrereqGraph() {
  const [prereqData, setPrereqData] = useState<ClassDataType | null>(null);
  const [parsedCourse, setParsedCourse] = useState<ParsedCourse | null>(null);
  const [paths, setPaths] = useState<string[][]>([]);
  const [graphData, setGraphData] = useState<any>(null); // Graph data for visualization
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
        const generatedPaths = generatePaths(parsed);
        setPaths(generatedPaths);
        const graph = transformToGraphData(generatedPaths);
        setGraphData(graph);
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    }
  }, [prereqData]);

  const handleBack = () => {
    router.push('/prereqs');
  };

  const parseCourse = (courseData: ClassDataType): ParsedCourse => {
    const code = `${courseData[4]} ${courseData[5]}`;
    const description = courseData[9] as string;
    const prerequisites = parsePrerequisites(description);
    return { code, prerequisites };
  };

  const parsePrerequisites = (description: string): CoursePrerequisites => {
    const prereqMatch = description.match(/Prerequisite:\s*(.*?)(?=\.\s|$)/);
    if (!prereqMatch) return [];

    const prerequisitesText = prereqMatch[1];
    return prerequisitesText.split(';').map(group => {
      const trimmed = group.trim();
      if (/^one of/i.test(trimmed)) {
        return trimmed
          .replace(/^one of/i, '')
          .split(/,|\bor\b/i)
          .map(option => option.trim())
          .filter(s => /^[A-Z]+\s+\d+$/.test(s));
      } else if (/\bor\b/i.test(trimmed)) {
        return trimmed
          .split(/\bor\b/i)
          .map(option => option.trim());
      } else {
        return [trimmed.split(',').join(' ')];
      }
    }).filter(group => group.length > 0);
  };

  const generateCombinations = (groups: CoursePrerequisites): string[][] => {
    const result: string[][] = [[]];
    for (const group of groups) {
      const newResult: string[][] = [];
      for (const option of group) {
        for (const combo of result) {
          newResult.push([...combo, option]);
        }
      }
      result.splice(0, result.length, ...newResult);
    }
    return result;
  };

  const generatePaths = (course: ParsedCourse): string[][] => {
    const combinations = generateCombinations(course.prerequisites);
    return combinations.map(combo => [...combo, course.code]);
  };

  const transformToGraphData = (paths: string[][]) => {
    const nodes: Set<string> = new Set();
    const links: any[] = [];
    const nodeMap: Map<string, string> = new Map();
    let nodeIndex = 0;

    // Create nodes with unique IDs and a map to original IDs
    paths.forEach(path => {
      path.forEach((node, index) => {
        if (!nodeMap.has(node)) {
          const uniqueId = `${node}_${nodeIndex++}`;
          nodeMap.set(node, uniqueId);
          nodes.add(uniqueId);
        }
      });
    });

    // Create links with unique source and target IDs
    paths.forEach(path => {
      path.forEach((node, index) => {
        if (index > 0) {
          const source = nodeMap.get(path[index - 1]);
          const target = nodeMap.get(node);
          if (source && target) {
            links.push({ source, target });
          }
        }
      });
    });

    // Calculate positions for hierarchical layout
    const nodeArray = Array.from(nodes);
    const levelMap: Map<string, number> = new Map();
    const positionMap: Map<string, { x: number, y: number }> = new Map();
    const nodeSpacing = 150;
    const levelSpacing = 100;

    const calculateNodeLevels = () => {
      const levelQueue: [string, number][] = [];

      nodeArray.forEach(node => {
        const nodeName = node.split('_')[0];
        if (paths.some(path => path[0] === nodeName)) {
          levelQueue.push([node, 0]);
        }
      });

      while (levelQueue.length > 0) {
        const [node, level] = levelQueue.shift()!;
        if (!levelMap.has(node) || level > (levelMap.get(node) || 0)) {
          levelMap.set(node, level);
          links.forEach(link => {
            if (link.source === node) {
              levelQueue.push([link.target, level + 1]);
            }
          });
        }
      }
    };

    calculateNodeLevels();

    const levelNodes: Map<number, string[]> = new Map();
    levelMap.forEach((level, node) => {
      if (!levelNodes.has(level)) {
        levelNodes.set(level, []);
      }
      levelNodes.get(level)!.push(node);
    });

    levelNodes.forEach((nodes, level) => {
      nodes.forEach((node, index) => {
        const x = index * nodeSpacing;
        const y = level * levelSpacing;
        positionMap.set(node, { x, y });
      });
    });

    const positionedNodes = nodeArray.map(id => ({
      id,
      x: positionMap.get(id)?.x || 0,
      y: positionMap.get(id)?.y || 0,
    }));

    return {
      nodes: positionedNodes,
      links
    };
  };

  const myConfig = {
    nodeHighlightBehavior: true,
    node: {
      color: "lightblue",
      size: 120,
      highlightStrokeColor: "blue"
    },
    link: {
      highlightColor: "blue"
    },
    staticGraph: true, // Disable dragging
    directed: true, // Use directed layout
  };

  return (
    <>
      <Button onClick={handleBack}>Back</Button>
      <h1>Prerequisite Paths</h1>
      {parsedCourse && (
        <div>
          <h2>Paths to {parsedCourse.code}:</h2>
          <ul>
            {paths.map((path, index) => (
              <li key={index}>{path.join(" → ")}</li>
            ))}
          </ul>
          {graphData && (
            <Graph
              id="prereq-graph"
              data={graphData}
              config={myConfig}
            />
          )}
        </div>
      )}
    </>
  );
}