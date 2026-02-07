// models/Booking.js
import mongoose from "mongoose";
import { serviceCategories } from "../data.js";

export const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    required: true,
  },
  serviceDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending",
  },
  address: String,
  descripton: { type: String, optional: true },
  serviceType: { type: String, required: true, enum: serviceCategories },
  warrantyUntil: { type: Date, default: Date.now() + 3600000 },
});

export const Booking = mongoose.model("Booking", bookingSchema);
