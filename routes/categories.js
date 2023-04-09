const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category')
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post("/createCategory", categoryController.createCategory);
router.post("/createItem/:id", categoryController.createItem);
router.post("/editCategory/", categoryController.editCategory);
router.post("/editItem/", categoryController.editItem);
router.delete("/deleteItem", categoryController.deleteItem)

module.exports = router;

