module.exports = {
    getDashboard: (req, res) => {
      res.render("dashboard.ejs");
    },
    getOrders: (req, res) => {
      res.render("orders.ejs");
    },
    getSettings: (req, res) => {
      res.render("settings.ejs");
    },
  };