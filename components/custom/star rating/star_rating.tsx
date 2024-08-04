// app/components/StarRating.tsx
import React, { useState } from 'react';
import { styles } from './styles';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div style={styles.starRating}>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onRatingChange(ratingValue)}
              style={styles.starRatingInput}
            />
            <span
              style={{
                ...styles.star,
                ...(ratingValue <= (hover || rating) ? styles.filled : {}),
              }}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            >
              ★
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;