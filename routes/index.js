const restaurantRoutes = require("./recipes");
const reviewRoutes = require("./reviews");

const constructorMethod = app => {
  app.use("/restaurants", restaurantRoutes);
  app.use("/reviews", reviewRoutes);
  app.use("/users", userRoutes);
  app.use("/comments", commentRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page not found" });
  });
};

module.exports = constructorMethod;
