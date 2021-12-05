const express = require("express");
const router = express.Router();
const userRoutes = require("./users");
const ingredientRoutes = require("./ingredients");
const recipeRoutes = require("./recipes");
const reviewRoutes = require("./reviews");
const commentRoutes = require("./comments");

const constructorMethod = app => {
  app.use("/recipes", recipeRoutes);

  app.use("/reviews", reviewRoutes);
  // app.use("/users", userRoutes);
  // app.use("/comments", commentRoutes);
  app.use("/ingredients", ingredientRoutes);
  app.use("/", (req, res) => {
    res.render("home");
  });
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page not found" });
  });
};

module.exports = constructorMethod;
