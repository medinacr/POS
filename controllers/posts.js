const cloudinary = require("../middleware/cloudinary");
const Categories = require("../models/Categories");
const Users = require('../models/User')
const Tables = require('../models/Tables')
const Order = require('../models/Order');
const Comment = require('../models/Comment')
const Post = require('../models/Post');
const mongoose = require('mongoose');
const { calculateObjectSize } = require("bson");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      //retrieve the selected table from mongodb
      const categories = await Categories.find().sort({ createdAt: "desc" }).lean();
      const loggedUser = req.user.id
      const users =  await Users.find({ _id: loggedUser })
      const tables = await Tables.find({userId: loggedUser});

      res.locals.feed = true;
      res.render("feed.ejs", { categories: categories, id: req.params.id, users: req.users, users: users, tables: tables});
    } catch (err) {
      console.log(err);
    }
  },
  fetchData: async (req, res) => {
    try {
      //retrieve the selected table from mongodb
      const categories = await Categories.find().sort({ createdAt: "desc" }).lean();
      const loggedUser = req.user.id
      const tables = await Tables.find({userId: loggedUser});
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({tables: tables}));
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({postId: req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  placeOrder: async (req, res) => {
    const user = req.user
    const data = req.body
    const orderId = mongoose.Types.ObjectId(data.id)
    // console.log(data)
      try {
      const order = await Tables.findOne({ _id: orderId })
      let newOrder;

      if(order) {
        newOrder = new Order({
          tableNumber: data.tableNumber.tableNumber,
          userId: data.tableNumber.userId,
          items: data.tableNumber.items,
          totalPrice: data.totalPriceBill,
          completedAt: new Date()
        })
      }
      await newOrder.save();
      await Tables.deleteOne({ _id: orderId });
      await res.redirect("/feed")
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" })
    }
  },
  getOrders: async (req, res) => {
    const loggedUser = req.user.id

    try {
      const data = await Order.find({userId: loggedUser})
      res.render('orders.ejs', { data: data })
    } catch(err) {
      console.log(err)
    }
    
  },
  getSettings: (req, res) => {
    res.render('settings.ejs')
  }
};
