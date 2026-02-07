// controllers/workers.js
import { Worker } from "../models/Worker.js";
import { User } from "../models/User.js";
import { Booking } from "../models/Booking.js";

export async function searchWorkers(req, res) {
  try {
    const {
      location,
      serviceCategory,
      minRating,
      availability,
      minPrice,
      maxPrice,
    } = req.query;

    // Build base query
    const query = {};

    // Location filter (search in User addresses)
    if (location) {
      const users = await User.find({
        address: { $regex: new RegExp(location, "i") },
      });
      query.user = { $in: users.map((u) => u._id) };
    }

    // Direct filters
    if (serviceCategory) {
      query.serviceCategory = { $regex: new RegExp(serviceCategory, "i") };
    }
    if (minRating) query.ratings = { $gte: Number(minRating) };
    if (availability) query.availability = availability;
    if (minPrice || maxPrice) {
      query.$or = [
        {
          hourlyRate: {
            $gte: Number(minPrice || 0),
            $lte: Number(maxPrice || 9999),
          },
        },
        {
          fixedPrice: {
            $gte: Number(minPrice || 0),
            $lte: Number(maxPrice || 9999),
          },
        },
      ];
    }

    // Fetch workers based on the query
    const workers = await Worker.find(query).populate("user").limit(50);

    // Check for expired bookings and update worker availability
    for (const worker of workers) {
      const expiredBooking = await Booking.findOne({
        worker: worker._id,
        serviceDate: { $lt: new Date() }, // Booking date is in the past
        status: { $ne: "cancelled" }, // Exclude cancelled bookings
      });

      if (expiredBooking) {
        worker.availability = true;
        await worker.save();
      }
    }

    res.send(workers);
  } catch (error) {
    console.error("Error searching workers:", error);
    res.status(500).send({ message: "Error searching workers" });
  }
}

export async function getWorker(req, res) {
  console.log(req.params.id, "in getWorker");
  try {
    const worker = await Worker.find({ user: req.params.id }).populate("user");
    // .populate({
    //   path: "reviews",
    //   populate: { path: "user", select: "name" },
    // });

    if (!worker) return res.status(404).send({ message: "Worker not found" });

    res.send(worker);
  } catch (error) {
    console.log(req.params.id);

    res.status(500).send({ message: "Error fetching worker details" });
  }
}

export async function updateWorker(req, res) {
  try {
    // Find the worker by ID
    console.log(req.params.id, req.body, "req.params.id");

    const worker = await Worker.find({ user: req.params.id });
    console.log(worker, "worker");

    if (!worker) {
      return res.status(404).send({ message: "Worker not found" });
    }

    // Verify ownership
    if (worker[0].user.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "Unauthorized" });
    }

    const updates = {
      address: req.body.address[0],
      serviceCategory: req.body.serviceCategory,
      hourlyRate: req.body.hourlyRate,
      fixedPrice: req.body.fixedPrice,
      availability: req.body.availability,
    };

    const updatedWorker = await Worker.findByIdAndUpdate(
      worker[0]._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("user", "name address");

    res.send(updatedWorker);
  } catch (error) {
    res.status(400).send({ message: "Error updating worker profile" });
  }
}

export async function getWorkerRating(req, res) {
  try {
    const worker = await Worker.findById(req.params.id).select("ratings");
    res.send({ rating: worker.ratings });
  } catch (error) {
    res.status(500).send({ message: "Error fetching rating" });
  }
}

export async function checkWorkerAvailability(req, res) {
  try {
    const { serviceDate } = req.query;
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).send({ message: "Worker not found" });
    }

    // Check if the worker is already booked for the selected date
    const existingBooking = await Booking.findOne({
      worker: worker._id,
      serviceDate: new Date(serviceDate),
    });

    res.send({ available: !existingBooking });
  } catch (error) {
    console.error("Error checking worker availability:", error);
    res.status(500).send({ message: "Error checking worker availability" });
  }
}
