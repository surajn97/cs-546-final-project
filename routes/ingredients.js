const express = require("express");
const router = express.Router();
const data = require("../data");
const ingredientsData = data.ingredients;
const recipeData = data.recipes;
const helper = data.helper;

router.get("/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  try {
    let ingredient = await ingredientsData.get(req.params.id);
    res.status(200).json(ingredient);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

// router.post("/ingredient-search", async (req, res) => {
//   const searchText = req.body.ingredientSearchText;
//   try {
//     helper.checkProperString(searchText, "Ingredient Search");
//     const result = await ingredientsData.searchIngredient(searchText);
//     res.render("ingredients", {
//       categorizedIngredients: result,
//     });
//   } catch (e) {
//     res.status(400).json({ error: e });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const categorizedIngredients = await ingredientsData.getAll();
    res.render("ingredients", {
      categorizedIngredients: categorizedIngredients,
      ingredients_page: true,
    });
  } catch (e) {
    res.status(500).json({ error: e });
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
    res
      .status(400)
      .json({ error: "You must provide data to update an ingredient" });
    return;
  }
  try {
    helper.checkProperString(updatedData.name, "Ingredient Name");
    helper.checkProperString(updatedData.category, "Ingredient Category");
    helper.checkProperNumber(updatedData.protien, "Ingredient Protien");
    helper.checkProperNumber(updatedData.carb, "Ingredient Carb");
    helper.checkProperNumber(updatedData.fat, "Ingredient fat");
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  try {
    await ingredientsData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ error: e });
    return;
  }
  try {
    const updatedRecipe = await ingredientsData.update(
      req.params.id,
      updatedData.name,
      updatedData.location,
      updatedData.phoneNumber,
      updatedData.website,
      updatedData.priceRange,
      updatedData.cuisines,
      updatedData.serviceOptions
    );
    res.status(200).json(updatedRecipe);
  } catch (e) {
    res.status(500).json({ error: e });
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
    let ingredient = await ingredientsData.remove(req.params.id);
    res.status(200).json(ingredient);
    return;
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }
});

module.exports = router;
