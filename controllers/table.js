const Users = require('../models/User')
const ObjectID = require('mongodb').ObjectID;

module.exports = {
  createTable: async (req, res) => {
    try {
      const loggedUser = req.user.id
      const tableNumber = req.body.tableNumber
      await Users.updateOne({_id: loggedUser}, {$push: {tables: {tableNumber: tableNumber}} })
      res.redirect("/feed")
    } catch (err) {
      console.log(err)
      res.redirect("/feed")
    }
  },
  addItem: async (req, res) => {
    const loggedUser = req.user.id
    const {tableId, categoryId,itemId,itemName, itemPrice, itemQuantity} = req.body
    console.log(tableId, categoryId,itemId,itemName, itemPrice, itemQuantity)
    var data = {itemQuantity, itemName, itemPrice}
    try {
      await Users.updateOne(
        {_id: ObjectID(loggedUser), "tables._id": ObjectID(tableId)},
        {
          $push: {"tables.$.items": data}
        }, 
        {upsert:true}
      ) 
    } catch (err) {
      console.log(err)
      res.redirect("/feed")
    }
    res.redirect('/feed')
  },
  
}