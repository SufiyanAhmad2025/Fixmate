// components/RatingDialog.js
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import {toast} from "sonner"

export default function RatingDialog({ booking }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      await api.post('/reviews', {
        worker: booking.worker._id,
        bookingId: booking._id,
        rating,
        comment
      });
      toast('Thank you for your review!');
      setOpen(false);
    } catch (error) {
      toast(error.response?.data?.message || 'Error submitting review');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Rate Service</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate {booking.user.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <Rating
              style={{ maxWidth: 200 }}
              value={rating}
              onChange={setRating}
              className="mb-2 text-black bg-black"
            />
            <span className="text-sm text-gray-500">
              {rating === 0 ? 'Select rating' : `${rating} stars`}
            </span>
          </div>
          
          <Textarea
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
          
          <Button onClick={handleSubmit}>Submit Review</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}