import { Review } from '../models/Review.js';
import { Worker } from '../models/Worker.js';
// In review controller

export async function createReview(req, res) {
    console.log(req.body, "req.body in createReview");
    
    const review = new Review({...req.body, user: req.user._id});
    await review.save();
    
    // Update worker's average rating
    const worker = await Worker.findOne({user:req.body.worker})
    const reviews = await Review.find({ worker: req.body.worker });
    const totalRating = reviews?.reduce((sum, r) => sum + r.rating, 0);
    console.log(worker,reviews,"worker and review");
    
    worker.ratings = totalRating / reviews.length;
    
    await worker.save();
  
    res.status(201).send(review);
  }

  export async function getReviews(req, res) { 
    try {
      const reviews = await Review.find({ worker: req.params.workerId })
        .populate('user')
        .sort({ createdAt: -1 });
  
      res.send(reviews);
    } catch (error) {
      res.status(500).send({ message: 'Error fetching reviews' });
    }
  };