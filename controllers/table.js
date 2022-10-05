const Users = require('../models/User');
const ObjectID = require('mongodb').ObjectID;
const Tables = require('../models/Tables');

module.exports = {
  createTable: async (req, res) => {
    try {
      console.log('Creating Table...')
      const userId = req.user.id
      const tableNumber = req.body.tableNumber
      await Tables.create({ tableNumber: tableNumber, userId: userId, items: []});
      res.redirect("/feed")
    } catch (err) {
      console.log(err)
      res.redirect("/feed")
    }
  },
  addItem: async (req, res) => {

    const {tableId, itemName, itemPrice} = req.body
    var data = {tableId, itemName, itemPrice};

    try{
      const match = await Tables.find({_id: tableId, "items.itemName": itemName})
        .updateOne({ $inc: { "items.$.itemQuantity": 1 } });
      const matchFound = match.nModified;

      if(!matchFound) {
        await Tables.find({ _id: tableId, "items.itemName": { "$ne": itemName } })
        .updateOne({ "$push": { "items": { "itemName": itemName, "itemQuantity": 1 } }});
      }
    }
    catch (err) {
      console.log(err);
    }
  },
}