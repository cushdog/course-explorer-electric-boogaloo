import React from 'react';
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface Review {
  _id: string;
  type: 'review' | 'tip';
  rating?: number;
  text: string;
  studentEmail: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const textColor = '#000000';

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead style={{ color: textColor }}>Type</TableHead>
          <TableHead style={{ color: textColor }}>Rating</TableHead>
          <TableHead style={{ color: textColor }}>Content</TableHead>
          <TableHead style={{ color: textColor }}>Email</TableHead>
          <TableHead style={{ color: textColor }}>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review._id}>
            <TableCell style={{ color: textColor }}>{review.type === 'review' ? 'Review' : 'Tip'}</TableCell>
            <TableCell style={{ color: textColor }}>{review.type === 'review' ? '★'.repeat(review.rating || 0) : 'N/A'}</TableCell>
            <TableCell style={{ color: textColor }}>{review.text}</TableCell>
            <TableCell style={{ color: textColor }}>{review.studentEmail}</TableCell>
            <TableCell style={{ color: textColor }}>{new Date(review.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReviewList;
