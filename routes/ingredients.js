const express = require("express");
const router = express.Router();
const data = require("../data");
const ingredientsData = data.ingredients;
const helper = data.helper;
const xss = require("xss");

router.get("/:id", async (req, res) => {
  try {
    const id = xss(req.params.id);
    helper.checkAndGetID(id);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  try {
    let ingredient = await ingredientsData.get(id);
    res.status(200).json(ingredient);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.post("/", async (req, res) => {
  let ingreInfo = req.body;
  if (!ingreInfo) {
    e = "You must provide data to add ingredient";
    res.status(400).json({ error: e });
    return;
  }
  let name = xss(ingreInfo.name);
  let category = xss(ingreInfo.category);

  try {
    helper.checkProperString(name, "Ingredient Name");
    helper.checkProperString(category, "Ingredient Category");
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }

  try {
    const newIngredient = await ingredientsData.createByUser(name, category);
    return;
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }
});

router.get("/name/:name", async (req, res) => {
  try {
    helper.checkProperString(xss(req.params.name));
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  try {
    let ingredient = await ingredientsData.getByName(xss(req.params.name));
    res.status(200).json(ingredient);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.delete("/:id", async (req, res) => {
  const id = xss(req.params.id);
  try {
    helper.checkAndGetID(id);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  try {
    let ingredient = await ingredientsData.remove(id);
    res.status(200).json(ingredient);
    return;
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }
});

module.exports = router;
