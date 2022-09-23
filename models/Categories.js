const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
  category: String,
  items: [{
    name: String,
    price: Number,
    itemId: Number,
  }]
})

module.exports = mongoose.model('Category', CategoriesSchema)
