const express = require("express");
const router = express.Router();
const userRoutes = require("./users");
const ingredientRoutes = require("./ingredients");
const recipeRoutes = require("./recipes");
const reviewRoutes = require("./reviews");
const commentRoutes = require("./comments");
const privateRoutes = require("./private");
const homeRoutes = require("./home");

const constructorMethod = app => {
  app.use("/recipes/form", (req, res) => {
    if (req.session.user) {
      res.render("recipeform", {
        title: "Add Recipe",
        authenticated: req.session.user ? true : false,
      });
    } else {
      res.render("users/login", { error: "Please Login to add a recipe" });
    }
  });

  app.use("/recipes/page", (req, res) => {
    res.render("recipe", { title: "Recipe" });
  });
  app.use("/recipes", recipeRoutes);
  app.use("/users", userRoutes);
  app.use("/private", privateRoutes);
  app.use("/reviews", reviewRoutes);
  app.use("/comments", commentRoutes);
  app.use("/ingredients", ingredientRoutes);
  app.use("/", homeRoutes);
  app.use("*", (req, res) => {
    res.status(404).render("notFound");
  });
};
module.exports = constructorMethod;
