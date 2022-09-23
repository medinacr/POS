const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category')
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post('/createCategory', categoryController.createCategory)

module.exports = router;

