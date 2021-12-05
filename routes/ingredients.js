const express = require("express");
const router = express.Router();
const data = require("../data");
const ingredientsData = data.ingredients;
const helper = data.helper;

router.get("/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  try {
    let recipe = await ingredientsData.get(req.params.id);
    res.json(recipe);
    return;
  } catch (e) {
    res.status(404).json({ error: e });
    return;
  }
});

router.post("/ingredient-search", async (req, res) => {
  const searchText = req.body.ingredientSearchText;
  try {
    helper.checkProperString(searchText, "Ingredient Search");
    const result = await ingredientsData.searchIngredient(searchText);
    res.render("ingredients", {
      categorizedIngredients: result,
    });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post("/selected", async (req, res) => {
  console.log(req.body);
});

router.get("/", async (req, res) => {
  try {
    const categorizedIngredients = await ingredientsData.getAll();
    res.render("ingredients", {
      categorizedIngredients: categorizedIngredients,
      ingredients_page: true
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
    res.status(400).json({ error: "You must provide data to update a recipe" });
    return;
  }
  if (!updatedData.name) {
    res.status(400).json({ error: "You must provide a name" });

    return;
  }
  if (!updatedData.location) {
    res.status(400).json({ error: "You must provide a location" });

    return;
  }
  if (!updatedData.phoneNumber) {
    res.status(400).json({ error: "You must provide a phone Number" });

    return;
  }
  if (!updatedData.website) {
    res.status(400).json({ error: "You must provide a website" });

    return;
  }
  if (!updatedData.priceRange) {
    res.status(400).json({ error: "You must provide a price Range" });

    return;
  }
  if (!updatedData.cuisines) {
    res.status(400).json({ error: "You must provide a Cuisines" });

    return;
  }
  if (!updatedData.serviceOptions) {
    res.status(400).json({ error: "You must provide a service options" });

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
    res.json(updatedRecipe);
  } catch (e) {
    res.status(500).json({ error: e });
    return;
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
    let review = await ingredientsData.remove(req.params.id);
    res.json(review);

    return;
  } catch (e) {
    res.json({ error: e });
    res.status(500);
    return;
  }
});

module.exports = router;
