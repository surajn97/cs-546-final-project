const express = require("express");
const router = express.Router();
const data = require("../data");
const ingredientsData = data.ingredients;
const recipeData = data.recipes;
const helper = data.helper;

router.get("/", async (req, res) => {
  try {
    const categorizedIngredients = await ingredientsData.getAll();
    res.render("home", {
      categorizedIngredients: categorizedIngredients,
      recipeList: [],
      ingredientSuggestions: [],
      ingredientsSelected: false,
      title: "What's Cooking?",
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/", async (req, res) => {
  try {
    let recipesList = [],
      categorizedIngredients;
    const data = req.body.ingredientsList;
    if (!data) {
      res.status(200).redirect("/");
      return;
    }
    const dataObj = JSON.parse(req.body.ingredientsList);
    if (
      !dataObj ||
      dataObj.random === undefined ||
      dataObj.random === null ||
      !dataObj.ingredients
    ) {
      res.status(200).redirect("/");
      return;
    }
    try {
      helper.checkProperArrayAllowEmpty(dataObj.ingredients);
    } catch (e) {
      res.status(400).json({ error: e });
      return;
    }

    const recipeObj = await recipeData.getAll(dataObj.ingredients);
    //Redirect to a random recipe page
    if (dataObj.random && recipeObj.recipeList.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * recipeObj.recipeList.length
      );
      res.redirect("/recipes/" + recipeObj.recipeList[randomIndex]._id);
    } else {
      categorizedIngredients = await ingredientsData.getAllWithChecked(
        dataObj.ingredients
      );
      res.render("home", {
        categorizedIngredients: categorizedIngredients,
        recipeList: recipeObj.recipeList,
        ingredientSuggestions: recipeObj.ingredientSuggestions,
        ingredientsSelected: true,
        title: "What's Cooking?",
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});
module.exports = router;
