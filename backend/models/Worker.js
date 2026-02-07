import mongoose from "mongoose";
import { serviceCategories } from "../data.js";

export const workerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: { type: String, required: true },
  certifications: [String],
  serviceCategory: { 
    type: String, 
    required: true, 
    enum: serviceCategories, // Restrict to specific categories
  },
  hourlyRate: Number,
  fixedPrice: Number,
  availability: { type: Boolean, default: true },
  ratings: { type: Number, default: 0 },
  photos: [String],
  workerProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
  trustedBadge: { type: Boolean, default: false },
});

export const Worker = mongoose.model("Worker", workerSchema);