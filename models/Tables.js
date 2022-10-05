const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const TablesSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    items: [{
        itemPrice: Number,
        itemName: String,
        itemQuantity: 0,
    }]
});

module.exports = mongoose.model('Table', TablesSchema);