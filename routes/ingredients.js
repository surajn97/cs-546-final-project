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

router.get("/", async (req, res) => {
  try {
    let recipeList = await ingredientsData.getAll();
    res.json(recipeList);

    return;
  } catch (e) {
    res.status(500).json({ error: e });

    return;
  }
});

router.post("/", async (req, res) => {
  let recipeInfo = req.body;

  if (!recipeInfo) {
    res.status(400).json({ error: "You must provide data to create a recipe" });

    return;
  }
  if (!recipeInfo.name) {
    res.status(400).json({ error: "You must provide a name" });

    return;
  }
  if (!recipeInfo.location) {
    res.status(400).json({ error: "You must provide a location" });

    return;
  }
  if (!recipeInfo.phoneNumber) {
    res.status(400).json({ error: "You must provide a phone Number" });

    return;
  }
  if (!recipeInfo.website) {
    res.status(400).json({ error: "You must provide a website" });

    return;
  }
  if (!recipeInfo.priceRange) {
    res.status(400).json({ error: "You must provide a price Range" });

    return;
  }
  if (!recipeInfo.cuisines) {
    res.status(400).json({ error: "You must provide a Cuisines" });

    return;
  }
  if (!recipeInfo.serviceOptions) {
    res.status(400).json({ error: "You must provide a service options" });

    return;
  }
  if (recipeInfo.serviceOptions.dineIn == null) {
    res
      .status(400)
      .json({ error: "You must provide a service options dineIn" });

    return;
  }
  if (recipeInfo.serviceOptions.takeOut == null) {
    res
      .status(400)
      .json({ error: "You must provide a service options takeOut" });

    return;
  }
  if (recipeInfo.serviceOptions.delivery == null) {
    res
      .status(400)
      .json({ error: "You must provide a service options delivery" });
    return;
  }

  try {
    const newRecipe = await ingredientsData.create(
      recipeInfo.name,
      recipeInfo.location,
      recipeInfo.phoneNumber,
      recipeInfo.website,
      recipeInfo.priceRange,
      recipeInfo.cuisines,
      recipeInfo.serviceOptions
    );
    res.json(newRecipe);

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
