import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Add bcrypt for password hashing
import { User } from "../models/User.js";
import { Worker } from "../models/Worker.js";

// Generate JWT token with expiration and secret key
function generateAuthToken(user) {
  return jwt.sign(
    { _id: user._id, role: user.role }, // Payload
    process.env.JWT_SECRET, // Secret key from environment variables
    { expiresIn: "7d" } // Token expiration (7 days)
  );
}

export async function register(req, res) {
  try {
    const { role, ...userData } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already exists" });
    }

    const existingPhone = await User.findOne({ phoneNumber: userData.phoneNumber });
    if (existingPhone) {
      return res.status(400).send({ message: "Phone number already exists" });
    }


    // Hash password before saving
    // userData.password = await bcrypt.hash(userData.password, 8);

    const user = new User({ ...userData, role });
    await user.save();

    if (role === "worker") {
      const worker = new Worker({ user: user._id, ...req.body.workerDetails });
      await worker.save();

      // Set the workerProfile field in the User document
      user.workerProfile = worker._id;
      await user.save();

    }

    const token = generateAuthToken(user);
    res.status(201).send({ user, token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ message: "Error during registration" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email,password });
    if (!user) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    // Check password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(400).send({ message: "Invalid email or password" });
    // }


    const token = generateAuthToken(user);
    res.send({ user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Error during login" });
  }
}

// export async function updateUserProfile(req, res) {
//   try {
//     const updates = {
//       name: req.body.name,
//       email: req.body.email,
//       address: req.body.address,
//     };

//     // Check if email is being updated and if it already exists
//     if (updates.email) {
//       const existingUser = await User.findOne({ email: updates.email });
//       if (existingUser && existingUser._id.toString() !== req.user._id) {
//         return res.status(400).send({ message: "Email already exists" });
//       }
//     }

//     // Update password if provided
//     if (req.body.password) {
//       updates.password = await bcrypt.hash(req.body.password, 8);
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { $set: updates },
//       { new: true, runValidators: true }
//     ).select("-password");

//     res.send(user);
//   } catch (error) {
//     console.error("Profile update error:", error);
//     res.status(400).send({
//       message:
//         error.code === 11000
//           ? "Email already exists"
//           : "Error updating profile",
//     });
//   }
// }

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, address, password, profilePicture } = req.body;

    const updates = { name, email, address, profilePicture };
    if (password) updates.password = password;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    );

    res.send(user);
  } catch (error) {
    res.status(400).send({ message: "Error updating profile" });
  }
};

export async function getCurrentUser(req, res) {
  try {
    console.log("Fetching user with ID:", req.user._id); // Debugging

    // Fetch the user and populate the workerProfile field if the user is a worker
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate({
        path: "workerProfile",
        select: "address serviceCategory hourlyRate availability ratings", // Select specific fields
      });

    if (!user) {
      console.log("User not found in database"); // Debugging
      return res.status(404).send({ message: "User not found" });
    }

    console.log("User found:", user); // Debugging
    res.send(user);
  } catch (error) {
    console.error("Error fetching user:", error); // Debugging
    res.status(500).send({ message: "Error fetching user profile" });
  }
}