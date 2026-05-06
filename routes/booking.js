const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking");

// (optional for now, we’ll add login later)
// const { isLoggedIn } = require("../middleware");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Booking route working ✅");
});

// ✅ REAL BOOKING ROUTE
router.post("/create", bookingController.createBooking);

module.exports = router;