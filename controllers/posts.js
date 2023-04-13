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
    const userName = req.user.userName

    try {
      //retrieve the selected table from mongodb
      const categories = await Categories.find().sort({ createdAt: "desc" }).lean();
      const loggedUser = req.user.id
      const users =  await Users.find({ _id: loggedUser })
      const tables = await Tables.find({userId: loggedUser});
      const color = users[0].color
      console.log()
      res.locals.feed = true;
      res.render("feed.ejs", { categories: categories, id: req.params.id, users: req.users, users: users, tables: tables, loggedUser: loggedUser, userName: userName, color: color});
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

      try {
      const order = await Tables.findOne({ _id: orderId })
      let newOrder;
      
      if(order) {
        const items = [];
        for({itemName, itemQuantity, itemPrice} of data.tableNumber.items){
          items.push({itemName, itemQuantity, itemPrice});
        }
        newOrder = new Order({
          tableNumber: data.tableNumber.tableNumber,
          userId: mongoose.Types.ObjectId(data.tableNumber.userId),
          items,
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
    const userName = req.user.userName
    const color = req.user.color

    try {
      const data = await Order.find({userId: loggedUser})
      const dateMap = new Map();
      for(let i=0; i < data.length; i++) {

        const orderDate = data[i].completedAt
        const date = new Date(orderDate)
        let dateOrders = dateMap.get(date.toLocaleDateString())
        console.log(date.getUTCDate())

        if(dateOrders) {
          dateOrders.push(data[i])
        }else {
          dateOrders = [data[i]]
        }
        dateMap.set(date.toLocaleDateString(), dateOrders)
      }
      const myObj = Object.fromEntries(dateMap);
      res.render('orders.ejs', { data: data , dateMap: myObj, loggedUser: loggedUser, userName: userName, color: color});
    } catch(err) {
      console.log(err)
    }
    
  },
  getCategories: async (req, res) => {
    const loggedUser = req.user.id
    const userName = req.user.userName
    const color = req.user.color
    const user = req.user

    try {
      const categoryData = await Categories.find()
      res.render('categories.ejs', { userName: userName, categoryData: categoryData, color: color, user: user })
    } catch (err) {
      console.log(err)
    }
  },
  getSettings: async (req, res) => {
    const loggedUser = req.user.id
    const userName = req.user.userName
    const color = req.user.color
    const user = req.user
    res.render('settings.ejs', { userName: userName, loggedUser: loggedUser, color: color, user: user})
  },
  deleteCategory: async (req, res) => {

      try{
        const tableId = req.body.tableId
        await Categories.findOneAndDelete({_id: tableId})

      } catch(err) {
        console.log(err)
      }
  },
  getProducts: async (req, res) => {
    const loggedUser = req.user.id
    const userName = req.user.userName
    const color = req.user.color
    const user = req.user

    try {
      const categoryData = await Categories.find()
      res.render('products.ejs', { userName: userName, categoryData: categoryData, color: color, user: user })
    } catch (err) {
      console.log(err)
    }
  },
  colorChange: async (req, res) => {
    const color = req.body.data.color
    const loggedUser = req.body.data.loggedUser
    const filter = { _id: loggedUser };
    const update = { color: color };
    const options = { new: true, upsert: true };

    const user = await Users.findOneAndUpdate(filter, update, options);
  }, 
  editName: async (req,res) => {
    const name = req.body.name
    const loggedUser = req.body.loggedUser
    
    try {
      const update = await Users.findOneAndUpdate(
        { _id: loggedUser },
        { userName: name },
        { new: true }
      )
      console.log(update)
      res.status(200).send('Name updated successfully');
    } catch (err) {
      console.log(err)
      res.status(500).send('Error updating name');
    }
  }
}