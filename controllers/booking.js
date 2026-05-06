const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut } = req.body;

    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    // ❗ Conflict check
    const existingBooking = await Booking.find({
      listing: listingId,
      $or: [
        {
          checkIn: { $lte: newCheckOut },
          checkOut: { $gte: newCheckIn }
        }
      ]
    });

    if (existingBooking.length > 0) {
      return res.send("❌ Already booked for these dates");
    }

    const listing = await Listing.findById(listingId);

    const days = (newCheckOut - newCheckIn) / (1000 * 60 * 60 * 24);
    const totalPrice = days * listing.price;

    const newBooking = new Booking({
      user: req.user ? req.user._id : null,
      listing: listingId,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      totalPrice
    });

    await newBooking.save();
    req.flash("success", "Booking Successful!");

    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    console.log(err);
    res.send("❌ Booking failed");
  }
};