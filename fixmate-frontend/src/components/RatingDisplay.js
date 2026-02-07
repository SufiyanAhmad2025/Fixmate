// components/RatingDisplay.js
'use client';
import { Rating } from '@smastrom/react-rating';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function RatingDisplay({ workerId }) {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      const { data } = await api.get(`/workers/${workerId}/rating`);
      setRating(data.rating);
    };
    fetchRating();
  }, [workerId]);

  return (
    <div className="flex items-center gap-2">
      <Rating 
        style={{ maxWidth: 100 }}
        value={rating}
        readOnly
      />
      <span className="text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );
}