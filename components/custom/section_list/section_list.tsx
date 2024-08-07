import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface Section {
  sectionId: string;
  status: string;
  startDate: string;
  endDate: string;
  type: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string;
  roomNumber: string;
  building: string;
  instructor: string;
}

interface SectionListProps {
  sections: Section[][];
}

const SectionList: React.FC<SectionListProps> = ({ sections }) => {
  const textColor = '#000000';

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead style={{ color: textColor }}>Section ID</TableHead>
          <TableHead style={{ color: textColor }}>Status</TableHead>
          <TableHead style={{ color: textColor }}>Type</TableHead>
          <TableHead style={{ color: textColor }}>Days</TableHead>
          <TableHead style={{ color: textColor }}>Time</TableHead>
          <TableHead style={{ color: textColor }}>Location</TableHead>
          <TableHead style={{ color: textColor }}>Instructor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sections.flat().map((section) => (
          <TableRow key={section.sectionId}>
            <TableCell style={{ color: textColor }}>{section.sectionId}</TableCell>
            <TableCell style={{ color: textColor }}>{section.status}</TableCell>
            <TableCell style={{ color: textColor }}>{section.type}</TableCell>
            <TableCell style={{ color: textColor }}>{section.daysOfWeek}</TableCell>
            <TableCell style={{ color: textColor }}>{`${section.startTime} - ${section.endTime}`}</TableCell>
            <TableCell style={{ color: textColor }}>{`${section.roomNumber} ${section.building}`}</TableCell>
            <TableCell style={{ color: textColor }}>{section.instructor}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SectionList;