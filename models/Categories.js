const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
  title: String,
  items: [{
    name: String,
    price: Number,
    itemId: Number,
  }]
})

module.exports = mongoose.model('Categories', CategoriesSchema)
