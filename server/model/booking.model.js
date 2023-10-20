const mongoose = require("mongoose");
const BookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  serviceDetails: {
    type: String,
    required: true,
  },
  adults: {
    type: Number,
    required: true,
  },
  childrens: {
    type: Number,
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  totalDays: {
    type: Number,
    required: true,
  },
  dateOfBooking: {
    type: Date,
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
});

const Booking = mongoose.model("booking", BookingSchema);
module.exports = Booking;