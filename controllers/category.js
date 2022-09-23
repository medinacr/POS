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
      res.redirect("/feed/")
    }
  }
}