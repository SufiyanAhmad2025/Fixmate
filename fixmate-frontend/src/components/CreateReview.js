'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Rating } from '@smastrom/react-rating';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import {toast} from "sonner"

export default function CreateReview({ workerId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      await api.post('/reviews', { workerId, rating, comment });
      toast({ message: 'Review submitted successfully!' });
      setOpen(false);
    } catch (error) {
      toast({
        message: error.response?.data?.message || 'Error submitting review'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Write a Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="mb-2">Rating:</p>
            <Rating
              style={{ maxWidth: 150 }}
              value={rating}
              onChange={setRating}
            />
          </div>
          
          <Textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          
          <Button onClick={handleSubmit}>Submit Review</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}