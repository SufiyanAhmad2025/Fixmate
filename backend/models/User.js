// models/User.js
import mongoose from "mongoose"

export const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'worker'], required: true },
    address: String,
    phoneNumber: { type: String },
    profilePicture: { type: String, default: "/profile-pics/pic1.png" },
    isVerified: { type: Boolean, default: false },
    workerProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
    createdAt: { type: Date, default: Date.now }
  });

export const User = mongoose.model('User', userSchema);