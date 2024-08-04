import React from 'react';

export const styles: { [key: string]: React.CSSProperties } = {
  starRating: {
    display: 'inline-block',
  },
  starRatingInput: {
    display: 'none',
  },
  star: {
    cursor: 'pointer',
    fontSize: '2em',
    color: '#ddd',
    transition: 'color 0.2s',
  },
  filled: {
    color: '#ffc107',
  },
};