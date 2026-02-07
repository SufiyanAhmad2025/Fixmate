// components/WorkerReviews.js
'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Rating } from '@smastrom/react-rating';

export default function WorkerReviews({ workerId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await api.get(`/reviews/${workerId}`);
      setReviews(data);
    };
    fetchReviews();
  }, [workerId]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review._id}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{review.user.name}</CardTitle>
                <Rating 
                  style={{ maxWidth: 100 }}
                  value={review.rating}
                  readOnly
                />
              </div>
            </CardHeader>
            <CardContent>
              <p>{review.comment}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}