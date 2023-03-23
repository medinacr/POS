const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  items: [{
    itemName: {
      type: String,
      required: true
    },
    itemQuantity: {
      type: Number,
      required: true
    },
    itemPrice: {
      type: Number,
      required: true
    }
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = mongoose.model('Order', orderSchema);