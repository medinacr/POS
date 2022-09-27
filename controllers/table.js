const Users = require('../models/User')

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
  }
}