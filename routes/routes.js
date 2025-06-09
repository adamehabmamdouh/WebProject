// Import your routes here...
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const indexRoutes = require("./indexRoutes");
const ejs = require("ejs");

function setupRoutes(app) {
  app.use('/', indexRoutes);
  app.use('/', authRoutes);
  app.use('/user', userRoutes);
  app.use((req, res, next) => {
   res.render("404", {
  currentPage: "404",
  title: "Page Not Found", // ← ADD THIS LINE
  user: req.session.user === undefined ? "" : req.session.user,
    });
  });
  
}

module.exports = { setupRoutes };
