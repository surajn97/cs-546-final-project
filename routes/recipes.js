const express = require("express");
const router = express.Router();
const data = require("../data");
const recipeData = data.recipes;
const ingredientsData = data.ingredients;
const userData = data.users;
const reviewData = data.reviews;
const helper = data.helper;

router.get("/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  try {
    let recipe = await recipeData.get(req.params.id);
    let reviews = await reviewData.getAll(req.params.id);
    res.render("recipe", {
      data: recipe,
      reviews: reviews,
    });

    return;
  } catch (e) {
    res.status(404).json({ error: e });
    return;
  }
});

//When an ingredient is selected, this route is triggered
router.post("/selected", async (req, res) => {
  try {
    let ingredientsList = req.body;
    helper.checkProperObject(ingredientsList);
    helper.checkProperArrayAllowEmpty(ingredientsList.ingredients);
    const recipeList = await recipeData.getAll(ingredientsList.ingredients);
    const categorizedIngredients = await ingredientsData.getAll();
    res.render("recipeList", {
      recipeList: recipeList,
      categorizedIngredients: categorizedIngredients,
      recipes_page: true,
      test: "ingredient",
    });
  } catch (e) {
    res.status(500).json({ error: e });

    return;
  }
});

router.get("/", async (req, res) => {
  try {
    const categorizedIngredients = await ingredientsData.getAll();
    res.render("recipelist", {
      recipeList: [],
      categorizedIngredients: categorizedIngredients,
      recipes_page: true,
      test: "recipe",
    });
    return;
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }
});

router.post("/", async (req, res) => {
  let recipeInfo = req.body;

  if (!recipeInfo) {
    e = "You must provide data to update a recipe";
    res.status(400).json({ error: e });
    return;
  }
  const ctime = parseInt(recipeInfo.cookingTime);
  const serv = parseInt(recipeInfo.servings);
  let ingarray = [];
  const ing = `${recipeInfo.ingredients}`;

  let curentuser = req.session.user;

  try {
    helper.checkAndGetID(curentuser._id);
    helper.checkProperString(ing, "Individual ingredient String");
    ingarray = ing.split(",");
    helper.checkProperString(recipeInfo.name, "Name");
    helper.checkProperNumber(ctime, "Cooking Time");
    helper.checkProperArray(ingarray, "Ingredients");
    ingarray.forEach(element => {
      helper.checkProperString(element, "Individual ingredient");
    });
    helper.checkProperString(recipeInfo.mealType, "Meal Type");
    helper.checkProperString(recipeInfo.cuisine, "Cuisine");
    helper.checkProperString(recipeInfo.instructions, "Instructions");
    helper.checkProperNumber(serv, "Servings");
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  let postedBy = curentuser._id;

  try {
    const newRecipe = await recipeData.create(
      recipeInfo.name,
      postedBy,
      ctime,
      ingarray,
      recipeInfo.mealType,
      recipeInfo.cuisine,
      recipeInfo.instructions,
      serv
    );
    // res.json(newRecipe);
    res.render("recipe", {
      data: newRecipe,
      reviews: reviews,
    });
    return;
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }
});

router.put("/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  const updatedData = req.body;
  if (!updatedData) {
    e = "You must provide data to update a recipe";
    res.status(400).json({ error: e });
    return;
  }

  try {
    helper.checkProperString(updatedData.name, "Name");
    helper.checkProperNumber(updatedData.cookingTime, "Cooking Time");
    helper.checkProperArray(updatedData.ingredients, "Ingredients");
    updatedData.ingredients.forEach(element => {
      helper.checkProperString(element, "Individual ingredient");
    });
    helper.checkProperString(updatedData.mealType, "Meal Type");
    helper.checkProperString(updatedData.cuisine, "Cuisine");
    helper.checkProperString(updatedData.instructions, "Instructions");
    helper.checkProperNumber(updatedData.servings, "Servings");
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }

  try {
    const updatedRecipe = await recipeData.update(
      req.params.id,
      updatedData.name,
      updatedData.cookingTime,
      updatedData.ingredients,
      updatedData.mealType,
      updatedData.cuisine,
      updatedData.instructions,
      updatedData.servings
    );
    res.json(updatedRecipe);

    return;
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
});

router.patch("/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  const updatedData = req.body;
  let newUpdatedDataObj = {};
  if (!updatedData) {
    e = "You must provide data to update a recipe";
    res.status(400).json({ error: e });
    return;
  }

  try {
    const oldRecipe = await recipeData.get(req.params.id);
    if (updatedData.name && updatedData.name !== oldRecipe.name) {
      helper.checkProperString(updatedData.name, "Name");
      newUpdatedDataObj.name = updatedData.name;
    }

    if (
      updatedData.cookingTime &&
      updatedData.cookingTime !== oldRecipe.cookingTime
    ) {
      helper.checkProperNumber(updatedData.cookingTime, "Cooking Time");
      newUpdatedDataObj.cookingTime = updatedData.cookingTime;
    }

    if (
      updatedData.ingredients &&
      updatedData.ingredients !== oldRecipe.ingredients
    ) {
      helper.checkProperArray(updatedData.ingredients, "Ingredients");
      updatedData.ingredients.forEach(element => {
        helper.checkProperString(element, "Individual ingredient");
      });
      newUpdatedDataObj.cookingTime = updatedData.cookingTime;
    }

    if (updatedData.mealType && updatedData.mealType !== oldRecipe.mealType) {
      helper.checkProperString(updatedData.mealType, "Meal Type");
      newUpdatedDataObj.cookingTime = updatedData.cookingTime;
    }

    if (updatedData.cuisine && updatedData.cuisine !== oldRecipe.cuisine) {
      helper.checkProperString(updatedData.cuisine, "Cuisine");
      newUpdatedDataObj.cuisine = updatedData.cuisine;
    }

    if (
      updatedData.instructions &&
      updatedData.instructions !== oldRecipe.instructions
    ) {
      helper.checkProperString(updatedData.instructions, "Instructions");
      newUpdatedDataObj.instructions = updatedData.instructions;
    }

    if (updatedData.servings && updatedData.servings !== oldRecipe.servings) {
      helper.checkProperNumber(updatedData.servings, "Servings");
      newUpdatedDataObj.servings = updatedData.servings;
    }
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }

  if (Object.keys(newUpdatedDataObj).length !== 0) {
    try {
      const newUpdatedData = await recipeData.patch(
        req.params.id,
        newUpdatedDataObj
      );
      // res.json(newUpdatedData);
      res.render("recipe", {
        data: newUpdatedData,
        reviews: reviews,
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    res.status(500).json({
      error:
        "No fields have been changed from their inital values, so no update has occurred",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  try {
    let review = await recipeData.remove(req.params.id);
    res.json(review);

    return;
  } catch (e) {
    res.json({ error: e });
    res.status(500);
    return;
  }
});

module.exports = router;
