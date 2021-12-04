const express = require("express");
const router = express.Router();
// const restaurantRoutes = require("./recipes");
// const reviewRoutes = require("./reviews");
const ingredientRoutes = require("./ingredients");
const userRoutes = require("./users");
const privateRoutes = require('./private');


const constructorMethod = (app) => {
  app.use("/", userRoutes);
  app.use("/ingredients", ingredientRoutes);
  app.use('/private', privateRoutes);

  // router.get("/", async (req, res) => {
  //   try {
  //     res.render("layouts/main", {
  //       title: 'Test'
  //     });
  //   } catch (e) {
  //     res.status(404).json({ error: e });
  //     return;
  //   }
  // });

  // app.use("/restaurants", restaurantRoutes);
  // app.use("/reviews", reviewRoutes);
  // app.use("/users", userRoutes);
  // app.use("/comments", commentRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page not found" });
  });
};

module.exports = constructorMethod;
