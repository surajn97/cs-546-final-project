const axios = require("axios");
const mongoCollections = require("../config/mongoCollections");
const recipes = mongoCollections.recipes;
let { ObjectId } = require("mongodb");
const helper = require("./helper");
const gis = require("g-i-s");
const ingredientsData = require("./ingredients");
const userData = require("./users");
const { ingredients } = require("../config/mongoCollections");
const defaultRecipeImage = "/public/img/product/product-2.jpg";
const youtube = require("scrape-youtube");

const getYoutubeLinkScraped = async (title) => {
  const results = await youtube.search(`${title} Recipe`);
  if (!results || !results.videos || results.videos.length == 0) {
    throw "Could not retrieve youtube URL";
  }
  return `https://www.youtube.com/embed/${results.videos[0].id}`;
};

const getgisRecipeImageLink = function (title) {
  return new Promise(function (resolve, reject) {
    gis(title + " Recipe", logResults);
    function logResults(error, results) {
      if (error) {
        resolve(defaultRecipeImage);
      } else {
        if (results.length > 0) resolve(results[0].url);
        else resolve(defaultRecipeImage);
      }
    }
  });
};

module.exports = {
  async create(
    name,
    postedBy,
    cookingTime,
    ingredients,
    mealType,
    cuisine,
    instructions,
    servings
  ) {
    helper.checkProperString(name, "Name");
    helper.checkProperString(postedBy, "User");
    helper.checkProperNumber(cookingTime, "Cooking Time");
    helper.checkProperArray(ingredients, "Ingredients");
    // helper.checkProperArray(otherIngredients, "Other Ingredients");
    ingredients.forEach((element) => {
      helper.checkProperObject(element, "Individual ingredient");
      helper.checkProperString(element.id, "Id of ingredient");
      helper.checkProperNumber(element.quantity, "Quantity of ingredient");
      helper.checkProperString(element.quantityMeasure, "Quantity Measure");
    });
    // otherIngredients.forEach(element => {
    //   helper.checkProperObject(element, "Other Ingredients Individual");
    //   helper.checkProperString(element.name, "Id of ingredient");
    //   helper.checkProperNumber(element.quantity, "Quantity of ingredient");
    //   helper.checkProperString(element.quantityMeasure, "Quantity Measure");
    // });

    helper.checkProperString(mealType, "Meal Type");
    helper.checkProperString(cuisine, "Cuisine");
    helper.checkProperString(instructions);
    helper.checkProperNumber(servings, "Servings");
    const recipeCollection = await recipes();
    let newRecipe = {
      name: name,
      postedBy: postedBy,
      cookingTime: cookingTime,
      ingredients: ingredients,
      mealType: mealType,
      cuisine: cuisine,
      overallRating: 0,
      instructions: instructions,
      reviews: [],
      servings: servings,
    };

    const insertInfo = await recipeCollection.insertOne(newRecipe);
    if (insertInfo.insertedCount === 0) throw "Could not create a Recipe";

    const newId = insertInfo.insertedId.toString();
    const recipe = await this.get(newId);
    return recipe;
  },

  async getWithOnlineData(id) {
    helper.checkProperString(id, "Recipe ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);
    const recipeCollection = await recipes();
    const recipe = await recipeCollection.findOne({ _id: ID });
    if (recipe === null) {
      throw "Error: No recipe with that id";
    }
    recipe._id = recipe._id.toString();
    recipe.postedBy = await userData.get(recipe.postedBy);
    let youtubeUrl;
    try {
      youtubeUrl = await getYoutubeLinkScraped(recipe.name); //Comment this and use bottom one for faster loading
      // youtubeUrl = "https://www.youtube.com/embed/lpU2zRzhJkQ";
    } catch (e) {
      youtubeUrl = "";
    }
    let calories = 0,
      protien = 0,
      carb = 0,
      fat = 0;
    for (let ingredient of recipe.ingredients) {
      const ig = await ingredientsData.get(ingredient._id);
      ingredient.name = ig.name;
      ingredient.text = `${ingredient.quantity} ${ingredient.quantityMeasure} ${ig.name}`;
      calories += ig.calories;
      protien += ig.protien;
      carb += ig.carb;
      fat += ig.fat;
    }
    recipe.calories = calories;
    recipe.protien = protien;
    recipe.carb = carb;
    recipe.fat = fat;
    const recipeImageUrl = await getgisRecipeImageLink(recipe.name);
    recipe.youtubeURL = youtubeUrl;
    recipe.recipeImageURL = recipeImageUrl;
    return recipe;
  },

  async get(id) {
    helper.checkProperString(id, "Recipe ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);
    const recipeCollection = await recipes();
    const recipe = await recipeCollection.findOne({ _id: ID });
    if (recipe === null) {
      throw "Error: No recipe with that id";
    }
    recipe._id = recipe._id.toString();
    return recipe;
  },

  async getAll(selectedIngredients) {
    const recipeCollection = await recipes();
    const recipeList = await recipeCollection.find({}).toArray();
    const rstList = [];
    const missingIngredientRecipes = await recipeCollection
      .find({
        "ingredients._id": { $in: selectedIngredients },
      })
      .toArray();

    let ingredientSuggestion = [];

    for (const rec of missingIngredientRecipes) {
      for (const rec_ing of rec.ingredients) {
        if (
          !selectedIngredients.includes(rec_ing._id) &&
          !ingredientSuggestion.some((e) => e._id === rec_ing._id)
        ) {
          ingredientSuggestion.push(await ingredientsData.get(rec_ing._id));
        }
      }
    }
    recipeList.forEach((item) => {
      if (item.ingredients.length <= selectedIngredients.length) {
        let flag = false;
        for (element of item.ingredients) {
          if (!selectedIngredients.includes(element._id)) {
            flag = false;
            break;
          }
          flag = true;
        }
        if (flag) {
          rstList.push(item);
        }
      }
    });
    for (let item of rstList) {
      item._id = item._id.toString();
      const url = await getgisRecipeImageLink(item.name);
      item.recipeImageURL = url;
      item.postedBy = await userData.get(item.postedBy);
    }
    return {
      recipeList: rstList,
      ingredientSuggestions: ingredientSuggestion,
    };
  },

  async remove(id) {
    helper.checkProperString(id, "Recipe ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);

    const recipeCollection = await recipes();

    const deletionInfo = await recipeCollection.deleteOne({ _id: ID });

    if (deletionInfo.deletedCount === 0) {
      throw `Error: Could not delete recipe with id of ${ID}`;
    }
    return { recipeId: id, deleted: true };
  },

  async update(
    id,
    name,
    cookingTime,
    ingredients,
    mealType,
    cuisine,
    instructions,
    servings
  ) {
    helper.checkProperString(name, "Name");
    helper.checkProperNumber(cookingTime, "Cooking Time");
    helper.checkProperArray(ingredients, "Ingredients");
    ingredients.forEach((element) => {
      helper.checkProperString(element, "Individual ingredient");
    }); //************* Store Ing ID or Name??? */
    helper.checkProperString(mealType, "Meal Type");
    helper.checkProperString(cuisine, "Cuisine");
    helper.checkProperString(instructions);
    helper.checkProperNumber(servings, "Servings");
    helper.checkProperString(id, "Recipe ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";

    let ID = ObjectId(id);
    const recipe = await this.get(id);

    let updatedRecipe = {
      name: name,
      postedBy: recipe.postedBy,
      cookingTime: cookingTime,
      ingredients: ingredients,
      mealType: mealType,
      cuisine: cuisine,
      overallRating: recipe.overallRating,
      instructions: instructions,
      reviews: recipe.reviews,
      servings: servings,
    };

    const recipeCollection = await recipes();
    const updateInfo = await recipeCollection.updateOne(
      { _id: ID },
      { $set: updatedRecipe }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    const recipen = await this.get(id);

    return recipen;
  },

  async patch(id, updatedData) {
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";

    let ID = ObjectId(id);
    let newUpdatedDataObj = await this.get(id);
    const oldRecipe = await this.get(id);

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
      updatedData.ingredients.forEach((element) => {
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
    delete newUpdatedDataObj._id;
    console.log(`newUpdatedDataObj: ${newUpdatedDataObj}`);
    const recipeCollection = await recipes();
    const updateInfo = await recipeCollection.updateOne(
      { _id: ID },
      { $set: newUpdatedDataObj }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    const recipen = await this.get(id);

    return recipen;
  },

  async modifyingRatings(recipeId) {
    helper.checkProperString(recipeId);
    if (!ObjectId.isValid(recipeId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(recipeId);
    let currentRecipe = await this.get(recipeId);
    let newRating = currentRecipe.overallRating;
    const len = currentRecipe.reviews.length;
    if (len == 0) {
      newRating = 0;
    } else {
      let currentRecipe = await this.get(recipeId);
      const reviewsarray = currentRecipe.reviews;
      let sumRating = reviewsarray
        .map((s) => s.rating)
        .reduce((a, b) => a + b, 0);
      newRating = sumRating / len;
    }
    const recipeCollection = await recipes();
    const updateInfo = await recipeCollection.updateOne(
      { _id: ID },
      { $set: { overallRating: newRating } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed at modifying rating of the recipe";

    return await this.get(recipeId);
  },

  async addReviewToRecipe(recipeId, reviewId, reviewobj) {
    if (!ObjectId.isValid(recipeId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(recipeId);

    if (!ObjectId.isValid(reviewId)) throw "Error: Not a valid ObjectId";
    let reviewID = ObjectId(reviewId);

    let currentRecipe = await this.get(recipeId);
    const recipeCollection = await recipes();
    const updateInfo = await recipeCollection.updateOne(
      { _id: ID },
      {
        $push: {
          reviews: {
            _id: reviewID,
            recipeId: reviewobj.recipeId,
            rating: reviewobj.rating,
            reviewText: reviewobj.reviewText,
            likes: reviewobj.likes,
            dislikes: reviewobj.dislikes,
            comments: reviewobj.comments,
            userId: reviewobj.userId,
            dateOfReview: reviewobj.dateOfReview,
          },
        },
      }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed at adding review to recipe";

    return await this.get(recipeId);
  },

  async removeReviewFromRecipe(recipeId, reviewId) {
    if (!ObjectId.isValid(recipeId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(recipeId);

    if (!ObjectId.isValid(reviewId)) throw "Error: Not a valid ObjectId";
    let reviewID = ObjectId(reviewId);

    let currentRecipe = await this.get(recipeId);

    const recipeCollection = await recipes();
    const updateInfo = await recipeCollection.updateOne(
      { _id: ID },
      { $pull: { reviews: { _id: reviewID } } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Error: Update failed while removing review from recipe";

    return await this.get(recipeId);
  },
};
