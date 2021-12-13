const express = require("express");
const router = express.Router();
const data = require("../data");
const recipeData = data.recipes;
const ingredientsData = data.ingredients;
const userData = data.users;
const reviewData = data.reviews;
const helper = data.helper;
const xss = require("xss");

let prevSentData;
let currentSort = {
  name: {
    current: true,
    up: true,
  },
  rating: {
    current: false,
    up: true,
  },
  time: {
    current: false,
    up: true,
  },
  ingredient: {
    current: false,
    up: true,
  },
};

let currentFilter = {
  mealType: {
    current: false,
    name: "",
  },
  cuisine: {
    current: false,
    name: "",
  },
};

function sort(list, prevCurr) {
  if (currentSort.name.current) {
    if (prevCurr && prevCurr.name.current == true)
      currentSort.name.up = !currentSort.name.up;
    if (currentSort.name.up) list.sort((a, b) => (a.name > b.name ? 1 : -1));
    else list.sort((a, b) => (a.name > b.name ? -1 : 1));
  } else if (currentSort.rating.current) {
    if (prevCurr && prevCurr.rating.current == true)
      currentSort.rating.up = !currentSort.rating.up;
    if (currentSort.rating.up)
      list.sort((a, b) => (a.overallRating > b.overallRating ? 1 : -1));
    else list.sort((a, b) => (a.overallRating > b.overallRating ? -1 : 1));
  } else if (currentSort.time.current) {
    if (prevCurr && prevCurr.time.current == true)
      currentSort.time.up = !currentSort.time.up;
    if (currentSort.time.up)
      list.sort((a, b) => (a.cookingTime > b.cookingTime ? 1 : -1));
    else list.sort((a, b) => (a.cookingTime > b.cookingTime ? -1 : 1));
  } else if (currentSort.ingredient.current) {
    if (prevCurr && prevCurr.ingredient.current == true)
      currentSort.ingredient.up = !currentSort.ingredient.up;
    if (currentSort.ingredient.up)
      list.sort((a, b) =>
        a.ingredients.length > b.ingredients.length ? 1 : -1
      );
    else
      list.sort((a, b) =>
        a.ingredients.length > b.ingredients.length ? -1 : 1
      );
  }
}

function filter(list) {
  if (!currentFilter.mealType.current && !currentFilter.cuisine.current)
    return list;
  let filteredData = [];
  for (const recipe of list) {
    if (
      recipe.mealType.toLowerCase() ==
        currentFilter.mealType.name.toLowerCase() &&
      recipe.cuisine.toLowerCase() == currentFilter.cuisine.name.toLowerCase()
    )
      filteredData.push(recipe);
    else if (
      recipe.mealType.toLowerCase() == currentFilter.mealType.name.toLowerCase()
    )
      filteredData.push(recipe);
    else if (
      recipe.cuisine.toLowerCase() == currentFilter.cuisine.name.toLowerCase()
    )
      filteredData.push(recipe);
  }
  return filteredData;
}

router.get("/all", async (req, res) => {
  try {
    const recipeList = await recipeData.getAllWithSearch("");
    sort(recipeList);
    const filterFields = recipeData.getFilterFields(recipeList);
    let user;
    if (req.session.user)
      user = await userData.get(req.session.user._id.toString());
    prevSentData = recipeList;
    res.status(200).render("allRecipes", {
      recipeList: recipeList,
      currentSort: currentSort,
      currentFilter: currentFilter,
      filterFields: filterFields,
      title: "What's Cooking?",
      error: false,
      user: user,
      authenticated: req.session.user ? true : false,
    });
  } catch (e) {
    res.status(400).render("allRecipes", {
      recipeList: [],
      recipes_page: true,
      currentSort: currentSort,
      currentFilter: currentFilter,
      filterFields: filterFields,
      title: "What's Cooking?",
      error: true,
      authenticated: req.session.user ? true : false,
    });
    return;
  }
});

router.post("/all", async (req, res) => {
  try {
    let search = xss(req.body.search);
    if (!search) search = "";
    if (typeof search !== "string") search = "";
    const recipeList = await recipeData.getAllWithSearch(search.trim());
    prevSentData = recipeList;
    const filterFields = recipeData.getFilterFields(recipeList);

    let user;
    if (req.session.user)
      user = await userData.get(req.session.user._id.toString());
    res.status(200).render("allRecipes", {
      recipeList: recipeList,
      currentSort: currentSort,
      currentFilter: currentFilter,
      filterFields: filterFields,
      title: "What's Cooking?",
      user: user,
      error: false,
      authenticated: req.session.user ? true : false,
    });
  } catch (e) {
    res.status(400).render("allRecipes", {
      recipeList: [],
      currentSort: currentSort,
      currentFilter: currentFilter,
      filterFields: filterFields,
      title: "What's Cooking?",
      error: true,
      authenticated: req.session.user ? true : false,
    });
    return;
  }
});

router.get("/all/filter", async (req, res) => {
  try {
    res.redirect("/recipes/all");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/all/filter", async (req, res) => {
  try {
    if (prevSentData === null) {
      res.status(200).redirect("/");
    } else {
      const sortData = xss(req.body.sort);
      const filterData = xss(req.body.filter);
      if (
        sortData == null ||
        sortData == undefined ||
        filterData == null ||
        filterData == undefined
      ) {
        res.status(200).redirect("/recipes/all");
        return;
      }
      const sortObj = JSON.parse(sortData);
      const prevCurr = currentSort;
      currentSort = sortObj;
      sort(prevSentData, prevCurr);
      const filterObj = JSON.parse(filterData);
      currentFilter = filterObj;
      const filteredList = filter(prevSentData);
      const filterFields = recipeData.getFilterFields(prevSentData);
      let user;
      if (req.session.user)
        user = await userData.get(req.session.user._id.toString());
      res.status(200).render("allRecipes", {
        recipeList: filteredList,
        currentSort: currentSort,
        currentFilter: currentFilter,
        filterFields: filterFields,
        user: user,
        title: "What's Cooking?",
        error: false,
        authenticated: req.session.user ? true : false,
      });
    }
  } catch (e) {
    res.status(400).json({
      error: e.toString(),
    });
  }
});

router.get("/form", (req, res) => {
  if (req.session.user) {
    res.render("recipeform", {
      title: "Add Recipe",
      firstname: req.session.user.firstname,
      user_page: true,
      my_recipe_page: true,
      authenticated: true,
    });
  } else {
    res.render("users/login", {
      error: "Please Login to add a recipe",
    });
  }
});

router.get("/page", (req, res) => {
  res.render("recipe", {
    title: "Recipe",
  });
});

router.get("/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400);
    res.render("error", { error: e, status: 400 });
    return;
  }
  try {
    let recipe = await recipeData.getWithOnlineData(req.params.id, true);
    let reviews = await reviewData.getAll(req.params.id);
    let user;
    if (req.session.user)
      user = await userData.get(req.session.user._id.toString());
    res.render("recipe", {
      data: recipe,
      reviews: reviews,
      user: user,
      title: recipe.name,
      authenticated: req.session.user ? true : false,
    });

    return;
  } catch (e) {
    res.status(404);
    res.render("error", { error: e, status: 400 });
    return;
  }
});

router.get("/editform/:id", async (req, res) => {
  if (!req.session.user) {
    res.render("users/login", {
      error: "Please Login to edit the recipe",
    });
    return;
  }
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400);
    res.render("error", { error: e });
    return;
  }
  try {
    let ids = xss(req.params.id);
    let recipe = await recipeData.get(xss(req.params.id));
    if (req.session.user._id != recipe.postedBy) {
      res.status(404).json({
        error: "Not your recipe",
      });
      return;
    }
    let ingArr = [];
    for (element of recipe.ingredients) {
      let ingObj = {};
      let ing = await ingredientsData.get(element._id);
      ingObj.name = ing.name;
      ingObj.quantity = element.quantity;
      ingObj.quantityMeasure = element.quantityMeasure;
      ingArr.push(ingObj);
    }
    res.render("editrecipeform", {
      ids: ids,
      name: recipe.name,
      title: "Edit Recipe",
      data: recipe,
      ingArr: JSON.stringify(ingArr),
      firstname: req.session.user.firstname,
      user_page: true,
      my_recipe_page: true,
      authenticated: req.session.user ? true : false,
    });
    return;
  } catch (e) {
    res.status(404);
    res.render("editrecipeform", { error: e });
    return;
  }
});

router.post("/", async (req, res) => {
  let recipeInfo = req.body;

  if (!recipeInfo) {
    e = "You must provide data to update a recipe";
    res.status(400);
    res.render(`recipeform`, { error: e });
    return;
  }
  const ing = recipeInfo.ingredients;
  const ctime = parseFloat(xss(recipeInfo.cookingTime));
  const serv = parseFloat(xss(recipeInfo.servings));

  let ingarray = JSON.parse(ing);

  let curentuser = req.session.user;

  try {
    helper.checkAndGetID(curentuser._id);
    // helper.checkProperString(ing, "Individual ingredient String");
    helper.checkProperString(xss(recipeInfo.name), "Name");
    helper.checkProperNumber(ctime, "Cooking Time");
    helper.checkProperArray(ingarray, "Ingredients");
    ingarray.forEach((element) => {
      const quant = parseFloat(element.quantity);
      element.quantity = quant;
      helper.checkProperObject(element, "Individual ingredient");
      helper.checkProperString(element.name, "Name of ingredient");
      helper.checkProperNumber(element.quantity, "Quantity of ingredient");
      helper.checkProperString(element.quantityMeasure, "Quantity Measure");
    });
    helper.checkProperString(recipeInfo.mealType, "Meal Type");
    helper.checkProperString(xss(recipeInfo.cuisine), "Cuisine");
    helper.checkProperString(xss(recipeInfo.instructions), "Instructions");
    helper.checkProperNumber(serv, "Servings");
  } catch (e) {
    res.status(400);
    // res.redirect(`recipes/form/`, { error: e });
    res.render(`recipeform`, { error: e });
    return;
  }
  let postedBy = curentuser._id;

  try {
    const newRecipe = await recipeData.create(
      xss(recipeInfo.name),
      postedBy,
      ctime,
      ingarray,
      recipeInfo.mealType,
      xss(recipeInfo.cuisine),
      xss(recipeInfo.instructions),
      serv,
      // should be logged in user id
      req.session.user._id.toString()
    );
    let recipe = await recipeData.getWithOnlineData(newRecipe._id, true);
    let reviews = await reviewData.getAll(newRecipe._id);
    res.redirect(`/recipes/${newRecipe._id}`);
    return;
  } catch (e) {
    res.status(500);
    res.render(`recipeform`, { error: e });
    return;
  }
});

router.post("/submit/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400);
    res.render(`editrecipeform`, { error: e });
    return;
  }
  const updatedData = req.body;

  if (!updatedData) {
    e = "You must provide data to update a recipe";
    res.status(400);
    // res.render(`error`, { error: e, status: 400 });
    res.render(`editrecipeform`, { error: e });
    return;
  }
  const ing = updatedData.ingredients;
  const ctime = parseFloat(xss(updatedData.cookingTime));
  const serv = parseFloat(xss(updatedData.servings));
  let ingarray = JSON.parse(ing);
  let curentuser = req.session.user;

  try {
    const oldRecipe = await recipeData.get(req.params.id);
    if (curentuser._id != oldRecipe.postedBy)
      throw "Cannot edit the recipe which you didnt create";
    helper.checkProperString(xss(updatedData.name), "Name");
    helper.checkProperNumber(ctime, "Cooking Time");
    helper.checkProperArray(ingarray, "Ingredients");
    ingarray.forEach((element) => {
      const quant = parseFloat(element.quantity);
      element.quantity = quant;
      helper.checkProperObject(element, "Individual ingredient");
      helper.checkProperString(element.name, "Name of ingredient");
      helper.checkProperNumber(element.quantity, "Quantity of ingredient");
      helper.checkProperString(element.quantityMeasure, "Quantity Measure");
    });
    helper.checkProperString(updatedData.mealType, "Meal Type");
    helper.checkProperString(xss(updatedData.cuisine), "Cuisine");
    helper.checkProperString(xss(updatedData.instructions), "Instructions");
    helper.checkProperNumber(serv, "Servings");
  } catch (e) {
    res.status(400);
    // res.render(`error`, { error: e, status: 400 });
    // res.redirect(`/editform/${req.params.id}`, { error: e, status: 400 });
    res.render(`editrecipeform`, { error: e });
    return;
  }

  try {
    const updatedRecipe = await recipeData.update(
      req.params.id,
      xss(updatedData.name),
      ctime,
      ingarray,
      updatedData.mealType,
      xss(updatedData.cuisine),
      xss(updatedData.instructions),
      serv
    );

    let recipe = await recipeData.getWithOnlineData(updatedRecipe._id, true);
    let reviews = await reviewData.getAll(updatedRecipe._id);
    res.redirect(`/recipes/${updatedRecipe._id}`);
  } catch (e) {
    res.status(500);

    res.render(`editrecipeform`, { error: e });
    return;
  }
});

router.put("/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({
      error: e,
    });
    return;
  }
  const updatedData = req.body;

  if (!updatedData) {
    e = "You must provide data to update a recipe";
    res.status(400).json({
      error: e,
    });
    return;
  }
  const ing = updatedData.ingredients;
  const ctime = parseFloat(updatedData.cookingTime);
  const serv = parseFloat(updatedData.servings);
  let ingarray = JSON.parse(ing);
  let curentuser = req.session.user;

  try {
    const oldRecipe = await recipeData.get(req.params.id);
    if (curentuser._id != oldRecipe.postedBy)
      throw "Cannot edit the recipe which you didnt create";
    helper.checkProperString(updatedData.name, "Name");
    helper.checkProperNumber(ctime, "Cooking Time");
    helper.checkProperArray(ingarray, "Ingredients");
    ingarray.forEach((element) => {
      const quant = parseFloat(element.quantity);
      element.quantity = quant;
      helper.checkProperObject(element, "Individual ingredient");
      helper.checkProperString(element.name, "Name of ingredient");
      helper.checkProperNumber(element.quantity, "Quantity of ingredient");
      helper.checkProperString(element.quantityMeasure, "Quantity Measure");
    });
    helper.checkProperString(updatedData.mealType, "Meal Type");
    helper.checkProperString(updatedData.cuisine, "Cuisine");
    helper.checkProperString(updatedData.instructions, "Instructions");
    helper.checkProperNumber(serv, "Servings");
  } catch (e) {
    res.status(400);
    res.redirect(`/recipes/${req.params.id}`, { error: e });
    return;
  }

  try {
    const updatedRecipe = await recipeData.update(
      req.params.id,
      updatedData.name,
      ctime,
      ingarray,
      updatedData.mealType,
      updatedData.cuisine,
      updatedData.instructions,
      serv
    );

    let recipe = await recipeData.getWithOnlineData(updatedRecipe._id, true);
    let reviews = await reviewData.getAll(newRecipe._id);
    res.redirect(`/recipes/${newRecipe._id}`);
    return;
  } catch (e) {
    res.status(500);
    res.redirect(`/recipes/${req.params.id}`, { error: e });
    return;
  }
});

router.patch("/:id", async (req, res) => {
  const updatedData = req.body;

  if (!updatedData) {
    e = "You must provide data to update a recipe";
    res.status(400).json({
      error: e,
    });
    return;
  }

  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({
      error: e,
    });
    return;
  }

  let newUpdatedDataObj = {};
  const ing = updatedData.ingredients;
  const ctime = parseFloat(updatedData.cookingTime);
  const serv = parseFloat(updatedData.servings);
  let ingarray = JSON.parse(ing);

  try {
    const oldRecipe = await recipeData.get(req.params.id);

    let curentuser = req.session.user;
    if (curentuser._id != oldRecipe.postedBy)
      throw "You cannot edit a recipe which you didnt create";

    if (updatedData.name && updatedData.name !== oldRecipe.name) {
      helper.checkProperString(updatedData.name, "Name");
      newUpdatedDataObj.name = updatedData.name;
    }

    if (
      updatedData.cookingTime &&
      updatedData.cookingTime !== oldRecipe.cookingTime
    ) {
      helper.checkProperNumber(ctime, "Cooking Time");
      newUpdatedDataObj.cookingTime = ctime;
    }

    if (
      updatedData.ingredients &&
      updatedData.ingredients !== oldRecipe.ingredients
    ) {
      helper.checkProperArray(ingarray, "Ingredients");
      ingarray.forEach((element) => {
        const quant = parseFloat(element.quantity);
        element.quantity = quant;
        helper.checkProperObject(element, "Individual ingredient");
        helper.checkProperString(element.name, "Name of ingredient");
        helper.checkProperNumber(element.quantity, "Quantity of ingredient");
        helper.checkProperString(element.quantityMeasure, "Quantity Measure");
      });
      newUpdatedDataObj.cookingTime = ingarray;
    }

    if (updatedData.mealType && updatedData.mealType !== oldRecipe.mealType) {
      helper.checkProperString(updatedData.mealType, "Meal Type");
      newUpdatedDataObj.cookingTime = updatedData.mealType;
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
    res.status(400).json({
      error: e,
    });
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
        authenticated: req.session.user ? true : false,
      });
    } catch (e) {
      res.status(500).json({
        error: e,
      });
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
    res.status(400).json({
      error: e,
    });
    return;
  }
  try {
    let review = await recipeData.remove(req.params.id);
    res.json(review);

    return;
  } catch (e) {
    res.json({
      error: e,
    });
    res.status(500);
    return;
  }
});

router.post("/favorite/:id", async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({
      status: "fail",
      error: "Unauthorized",
    });
    return;
  }
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({
      status: "fail",
      error: e,
    });
    return;
  }
  if (!req.params.id) {
    res.status(400).json({
      status: "fail",
      error: "You must provide a recipe id",
    });
    return;
  }

  try {
    const id = xss(req.params.id);
    const review = await recipeData.favorite(
      req.session.user._id.toString(),
      id
    );
    res.json({
      status: "success",
      message: "successfully added recipe to favorites",
    });
  } catch (e) {
    res.status(404).json({
      status: "fail",
      error: e,
    });
    // res.status(404);
    return;
  }
});

module.exports = router;
