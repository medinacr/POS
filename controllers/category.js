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
  
      // Get the updated category
      const category = await Category.findById(categoryId);
  
      // Get the new item that was added
      const newItem = category.items[category.items.length - 1];
  
      // Send the category and new item in the response
      console.log(category.category)
      res.status(200).json({ category: category.category, categoryId: category._id, newItem });
    } catch (err) {
      console.log(err);
      res.redirect("/feed");
    }
  },
  editCategory: async (req, res) => {
    const tableId = req.body.tableId
    const edit = req.body.edit
    try {
      console.log(req.body)
      await Category.updateOne({_id: tableId}, {$set: {category: edit}});
    } catch (err) {
      console.log(err);
    }
  },
  deleteItem: async (req, res) => {
    const categoryId = req.body.categoryId;
    const productId = req.body.productId;
  
    try {
      await Category.findOneAndUpdate(
        { _id: categoryId }, // find the category by ID
        { $pull: { items: { _id: productId } } } // delete the product by ID from the products array
      );
  
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    }
  },
  editItem: async (req, res) => {
    const categoryId = req.body.categoryId;
    const productId = req.body.productId;
    const productName = req.body.newProduct;
    const productPrice = req.body.newPrice;

    try {
      await Category.updateOne(
        { _id: categoryId, "items._id": productId },
        { $set: { "items.$.name": productName, "items.$.price": productPrice } }
      );
      res.status(200).send("Product updated successfully.");
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error.");
    }
  },
}