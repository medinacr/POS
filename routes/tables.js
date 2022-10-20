const express = require('express');
const router = express.Router();
const tableController = require('../controllers/table')
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post("/createTable", tableController.createTable);
router.post("/addItem", tableController.addItem);
router.post("/removeItem", tableController.removeItem);

module.exports = router;
