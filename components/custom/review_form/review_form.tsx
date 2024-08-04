import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '../star rating/star_rating';
import AdjustedSelect from '../../ui/adjusted_select';

interface ReviewFormProps {
  classId: string;
  studentEmail: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ classId, studentEmail, onReviewSubmitted }) => {
  const [type, setType] = useState<'review' | 'tip'>('review');
  const [rating, setRating] = useState<number>(0);
  const [text, setText] = useState<string>('');

  const reviewData = { classId, studentEmail, type, rating, text };
  console.log('Sending data:', reviewData);  // Add this line

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reviewData = {
      classId,
      studentEmail,
      type,
      rating: type === 'review' ? rating : undefined,
      text
    };
    console.log('Sending data:', reviewData);
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (response.ok) {
      // Handle successful submission
      setType('review');
      setRating(0);
      setText('');
      onReviewSubmitted();
    } else {
      const errorData = await response.json();
      console.error('Error submitting review:', errorData);
    }
  };

  const options = [
    { value: 'review', label: 'Review' },
    { value: 'tip', label: 'Tip' }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <AdjustedSelect
        item_to_select="Select type"
        options={options}
        selectedValue={type}
        onChange={value => setType(value as 'review' | 'tip')}
      />
      {type === 'review' && (
        <StarRating rating={rating} onRatingChange={setRating} />
      )}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={type === 'review' ? 'Write your review...' : 'Share your tip...'}
        required
        style={{ marginTop: '1rem', marginBottom: '1rem' }}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default ReviewForm;
