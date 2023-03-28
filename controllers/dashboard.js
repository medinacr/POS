const Categories = require("../models/Categories");
const Users = require('../models/User')
const Tables = require('../models/Tables')
const Order = require('../models/Order');
const Comment = require('../models/Comment')
const Post = require('../models/Post');
const mongoose = require('mongoose');
const { calculateObjectSize } = require("bson");

module.exports = {
    getDashboard: async (req, res) => {
      const loggedUser = req.user.id
      const userName = req.user.userName
      const date = new Date().toLocaleDateString();

      try {
        const data = await Order.find({userId: loggedUser})
        const categoryData = await Categories.find()
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

        const filteredData = data.filter(order => {
          const completedAtDate = new Date(order.completedAt).toLocaleDateString()
          return loggedUser && date === completedAtDate
        });
        res.render('dashboard.ejs', { data: data , dateMap: myObj, loggedUser: loggedUser, filteredData: filteredData, userName: userName, categoryData: categoryData, todaysDate: date});
      } catch(err) {
        console.log(err)
      }
    },
    getOrders: (req, res) => {
      res.render("orders.ejs");
    },
    getSettings: (req, res) => {
      res.render("settings.ejs");
    },
  };