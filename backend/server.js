// routes/api.js
import dotenv from "dotenv";
import express from "express";
import {
  createBooking,
  getSpecificBooking,
  getUserBookings,
  getWorkerBookings,
  updateBookingStatus,
} from "./controllers/bookings.js";
import { createReview, getReviews } from "./controllers/reviews.js";
import {
  searchWorkers,
  getWorker,
  updateWorker,
  getWorkerRating,
  checkWorkerAvailability,
} from "./controllers/workers.js";
import { auth } from "./middleware/auth.js";
import {
  register,
  login,
  updateUserProfile,
  getCurrentUser,
} from "./controllers/auth.js";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from your frontend
    credentials: true, // Allow cookies and credentials
  })
);

// Auth Routes
app.post("/auth/register", register);
app.post("/auth/login", login);

// Worker Routes
app.get("/workers", searchWorkers);
app.get("/workers/:id", getWorker);
app.put("/workers/:id", auth, updateWorker);
app.get("/workers/:id/rating", getWorkerRating);
// Backend API to check worker availability
app.get("/workers/:id/availability", checkWorkerAvailability);

// Booking Routes
app.post("/bookings", auth, createBooking);
app.get("/bookings/user", auth, getUserBookings);
app.get("/bookings/worker", auth, getWorkerBookings);
app.put("/bookings/:id", auth, updateBookingStatus);
app.get("/bookings/:id", auth, getSpecificBooking);

// Review Routes
app.post("/reviews", auth, createReview);
app.get("/reviews/:workerId", getReviews);

// New Profile Routes
app.get("/users/me", auth, getCurrentUser);
app.patch("/users/me", auth, updateUserProfile);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
