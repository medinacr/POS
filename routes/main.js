const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest, isAdmin } = require("../middleware/auth");


//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/fetchData", ensureAuth, postsController.fetchData);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get('/orders', ensureAuth, postsController.getOrders);
router.get('/categories',ensureAuth, postsController.getCategories);
router.get('/products',ensureAuth, postsController.getProducts);
router.get("/settings", ensureAuth, postsController.getSettings);
router.delete("/deleteCategory", ensureAuth, postsController.deleteCategory);
module.exports = router;
