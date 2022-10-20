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

    console.log("addItem START");
    const {tableId, itemName, itemPrice} = req.body

    try{
      const match = await Tables.find({_id: tableId, "items.itemName": itemName})
        .updateOne({ $inc: { "items.$.itemQuantity": 1 } });
      const matchFound = match.nModified;

      if(!matchFound) {
        await Tables.find({ _id: tableId, "items.itemName": { "$ne": itemName } })
        .updateOne({ "$push": { "items": { "itemName": itemName, "itemQuantity": 1, "itemPrice": itemPrice } }});
      }
    }
    catch (err) {
      console.log(err);
    }
    finally{res.redirect("/feed")}
    console.log("addItem END");
  },

  removeItem: async (req, res) => {

    const {tableId, itemName, itemPrice, itemQuantity} = req.body

    console.log(`Item quantity: ${itemQuantity}`);
    try{
      if(itemQuantity - 1 > 0){
         //Subtract 1 from item in mongodb
         console.log('Removed');
         await Tables.find({_id: tableId, "items.itemName": itemName})
           .updateOne({ $inc: { "items.$.itemQuantity": - 1 } });

      }else{
         //Remove item from Table items in mongodb
        // await Tables.updateOne({_id: tableId, "items.itemName": itemName})
        await Tables.find({_id: tableId, "items.itemName": itemName})
        .updateOne(
            {},
            { $pull: {items: {itemName}}});
      }
    }
    catch (err) {
      console.log(err);
    }
    finally{res.redirect("/feed")}
  },
}