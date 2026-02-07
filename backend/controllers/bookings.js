import { Booking } from "../models/Booking.js";
import { Worker } from "../models/Worker.js";

export async function createBooking(req, res) {
  console.log(req.user, req.body, "req");

  try {
    // Check worker availability
    const worker = await Worker.findById(req.body.workerId);
    console.log(worker);

    if (!worker) {
      return res.status(404).send({ message: "Worker not found" });
    }

    // Check if the booking date is in the past
    const bookingDate = new Date(req.body.serviceDate);
    bookingDate.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (bookingDate < now) {
      return res
        .status(400)
        .send({ message: "Booking date must be in the future" });
    }

    // Check if the user has already booked the same worker
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      worker: req.body.workerId,
      status: { $ne: "cancelled" }, // Exclude cancelled bookings
    });

    // if (existingBooking) {
    //   return res.status(400).send({
    //     message: "You have already booked this worker",
    //   });
    // }

    // Check if the worker is available for the selected date
    const conflictingBooking = await Booking.findOne({
      worker: req.body.workerId,
      serviceDate: {
        $gte: new Date(bookingDate), // Start of the day
        $lt: new Date(bookingDate.setDate(bookingDate.getDate() + 1)), // End of the day
      },
      status: { $ne: "cancelled" }, // Exclude cancelled bookings
    });

    if (conflictingBooking) {
      return res.status(400).send({
        message: "Worker is already booked for the selected date",
      });
    }

    // Create the booking
    const booking = new Booking({
      user: req.user._id,
      worker: req.body.workerId,
      serviceDate: req.body.serviceDate,
      address: req.body.address,
      serviceType: req.body.serviceType,
    });

    // Mark the worker as unavailable
    worker.availability = false;
    await worker.save();

    await booking.save();
    res.status(201).send(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(400).send({ message: "Error creating booking" });
  }
}
export async function getUserBookings(req, res) {
  console.log(req.user._id, "req.user._id in getuesrbookings");

  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("user") // Populate the user who made the booking
      .populate({
        path: "worker", // Populate the worker details
        populate: {
          path: "user", // Populate the worker's user object
        },
      }) // Populate the worker details
      .sort({ serviceDate: -1 });

    console.log("Worker bookings:", bookings);
    res.send(bookings);
  } catch (error) {
    console.log(error);

    res.status(500).send({ message: "Error fetching bookings" });
  }
}

export async function getWorkerBookings(req, res) {
  console.log(req.user._id, "req.user._id in getuesrbookings");

  try {
    const getWorker = await Worker.find({ user: req.user._id });
    console.log(getWorker, "getWorker");

    const bookings = await Booking.find({ worker: getWorker[0]._id })
      .populate("user") // Populate the user who made                                            the booking
      .populate("worker") // Populate the worker details
      .sort({ serviceDate: -1 });

    console.log("Worker bookings:", bookings);
    res.send(bookings);
  } catch (error) {
    console.log(error);

    res.status(500).send({ message: "Error fetching bookings" });
  }
}

export async function updateBookingStatus(req, res) {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("worker", "user")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).send({ message: "Booking not found" });
    }

    // Authorization check
    const isWorkerOwner =
      booking.worker.user.toString() === req.user._id.toString();
    const isUserOwner = booking.user._id.toString() === req.user._id.toString();

    // Only the worker can accept or reject the booking
    if (["accepted", "rejected"].includes(req.body.status)) {
      if (!isWorkerOwner) {
        return res.status(403).send({ message: "Unauthorized: Only the worker can accept or reject bookings" });
      }
    }

    // Only the user can cancel the booking
    if (req.body.status === "cancelled") {
      if (!isUserOwner) {
        return res.status(403).send({ message: "Unauthorized: Only the user can cancel bookings" });
      }
    }

    // Status transition validation
    const validTransitions = {
      pending: ["accepted", "rejected", "cancelled"], // Worker can accept/reject, user can cancel
      accepted: ["completed", "cancelled"], // Worker can mark as completed, user can cancel
      rejected: [], // No further transitions
      completed: [], // No further transitions
      cancelled: [], // No further transitions
    };

    if (!validTransitions[booking.status]?.includes(req.body.status)) {
      return res.status(400).send({ message: "Invalid status transition" });
    }

    // Update the booking status
    booking.status = req.body.status;

    // If the booking is accepted, mark the worker as unavailable
    if (req.body.status === "accepted") {
      const worker = await Worker.findById(booking.worker._id);
      if (worker) {
        worker.availability = false;
        await worker.save();
      }
    }

    // If the booking is completed or cancelled, mark the worker as available
    if (["completed", "cancelled"].includes(req.body.status)) {
      const worker = await Worker.findById(booking.worker._id);
      if (worker) {
        worker.availability = true;
        await worker.save();
      }
    }

    await booking.save();
    res.send(booking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).send({ message: "Error updating booking status" });
  }
}

export async function getSpecificBooking(req, res) {
  try {
    const booking = await Booking.findById(req.params.id).populate("user");
    if (!booking) {
      return res.status(404).send({ message: "Booking not found" });
    }
    res.send(booking);
  } catch (error) {
    res.status(400).send({ message: "Error retrieving booking" });
  }
}
