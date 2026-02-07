// components/ReviewModal.js
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ReviewModal = ({ workerId, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Please provide a rating between 1 and 5.");
      return;
    }

    try {
      await onSubmit({ workerId, rating, comment });
      onClose();
    } catch (error) {
      toast.error("Failed to submit review.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
};