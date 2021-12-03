const restaurantRoutes = require("./recipes");
const reviewRoutes = require("./reviews");
const userRoutes = require('./users');
const privateRoutes = require('./private');


const constructorMethod = app => {
  // app.use("/restaurants", restaurantRoutes);
  // app.use("/reviews", reviewRoutes);
  // app.use("/users", userRoutes);
  // app.use("/comments", commentRoutes);
  // app.use('/private', privateRoutes);
  // app.use('/', userRoutes); // If the user is authenticated, it will redirect to /private.
  // app.use('/private', privateRoutes);


  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page not found" });
  });
};

module.exports = constructorMethod;
