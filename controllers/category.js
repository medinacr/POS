const Category = require('../models/Categories')

module.exports = {
  createCategory: async (req, res) => {
    try {
      await Category.create({
        category: req.body.category,
      })
      res.redirect("/feed");
    } catch (err) {
      console.log(err);
      res.redirect("/feed")
    }
  },
  createItem: async (req, res) => {
    try {
      const itemName = req.body.itemName; 
      const itemPrice = req.body.itemPrice;
      const categoryId = req.params.id
      await Category.updateOne({_id: categoryId}, {$push: {items: {name: itemName, price: itemPrice}}})
      res.redirect("/feed");
    } catch (err) {
      console.log(err);
      res.redirect("/feed")
    }
  }
}