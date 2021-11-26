const recipeData = require("./recipes");
const reviewData = require("./reviews");
const userData = require("./users");
const commentData = require("./comments");
const ingreData = require("./ingredients");
const testData = require("./test")

module.exports = {
  recipes: recipeData,
  reviews: reviewData,
  users: userData,
  comments: commentData,
  ingredients: ingreData,
  test: testData
};
