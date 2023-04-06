const Category = require('../models/Categories')

module.exports = {
  createCategory: async (req, res) => {
    const category = req.body.category;
    try {
      const createdCategory = await Category.create({
        category: req.body.category,
      });
      const categoryId = createdCategory._id; // Retrieve the created _id
      // Include categoryId in the response
      await res.status(200).json(createdCategory.toJSON())
    } catch (err) {
      console.log(err);
      res.redirect("/feed"); 
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
  },
  editItem: async (req, res) => {
    const tableId = req.body.tableId
    const edit = req.body.edit
    try {
      console.log(req.body)
      await Category.updateOne({_id: tableId}, {$set: {category: edit}});
    } catch (err) {
      console.log(err);
    }
  }
}