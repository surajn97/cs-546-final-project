const express = require("express");
const xss = require("xss");
const router = express.Router();
const data = require("../data");
const ingredientsData = data.ingredients;
const recipeData = data.recipes;
const userData = data.users;
const helper = data.helper;
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

router.get("/", async (req, res) => {
  try {
    const categorizedIngredients = await ingredientsData.getAll();
    prevSentData = null;
    res.render("home", {
      categorizedIngredients: categorizedIngredients,
      recipeList: [],
      ingredientSuggestions: [],
      ingredientsSelected: false,
      currentSort: currentSort,
      currentFilter: currentFilter,
      filterFields: { mealType: [], cuisine: [] },
      title: "What's Cooking?",
      authenticated: req.session.user ? true : false,
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/filter", async (req, res) => {
  try {
    res.redirect("/");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/filter", async (req, res) => {
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
        res.status(200).redirect("/");
        return;
      }
      const sortObj = JSON.parse(sortData);
      const prevCurr = currentSort;
      currentSort = sortObj;
      sort(prevSentData.recipeList, prevCurr);
      const filterObj = JSON.parse(filterData);
      currentFilter = filterObj;
      const filteredList = filter(prevSentData.recipeList);
      let user;
      if (req.session.user)
        user = await userData.get(req.session.user._id.toString());
      const filterFields = recipeData.getFilterFields(prevSentData.recipeList);
      res.render("home", {
        categorizedIngredients: prevSentData.categorizedIngredients,
        recipeList: filteredList,
        ingredientSuggestions: prevSentData.ingredientSuggestions,
        user: user,
        ingredientsSelected: true,
        currentSort: currentSort,
        currentFilter: currentFilter,
        filterFields: filterFields,
        title: "What's Cooking?",
        authenticated: req.session.user ? true : false,
      });
    }
  } catch (e) {
    res.status(400).json({ error: e.toString() });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body.ingredientsList;
    if (!data) {
      res.status(200).redirect("/");
      return;
    }
    const dataObj = JSON.parse(xss(req.body.ingredientsList));
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
    let filteredList = [];
    if (recipeObj.recipeList.length > 0) {
      sort(recipeObj.recipeList);
      filteredList = filter(recipeObj.recipeList);
    }
    const categorizedIngredients = await ingredientsData.getAllWithChecked(
      dataObj.ingredients
    );
    prevSentData = {
      categorizedIngredients: categorizedIngredients,
      recipeList: recipeObj.recipeList,
      ingredientSuggestions: recipeObj.ingredientSuggestions,
    };
    let user;
    if (req.session.user)
      user = await userData.get(req.session.user._id.toString());
    //Redirect to a random recipe page
    if (dataObj.random && recipeObj.recipeList.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * recipeObj.recipeList.length
      );
      res.redirect("/recipes/" + recipeObj.recipeList[randomIndex]._id);
    } else {
      const filters = recipeData.getFilterFields(recipeObj.recipeList);
      res.render("home", {
        categorizedIngredients: categorizedIngredients,
        recipeList: filteredList,
        ingredientSuggestions: recipeObj.ingredientSuggestions,
        ingredientsSelected: true,
        currentSort: currentSort,
        currentFilter: currentFilter,
        filterFields: filters,
        user: user,
        title: "What's Cooking?",
        authenticated: req.session.user ? true : false,
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});
module.exports = router;
