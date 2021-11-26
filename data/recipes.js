const mongoCollections = require("../config/mongoCollections");
const recipes = mongoCollections.recipes;
let { ObjectId } = require("mongodb");
// const { users } = require(".");

module.exports = {
  async create(
    name,
    postedBy,
    time,
    ingredients,
    mealType,
    cuisine,
    instructions
  ) {
    checkProperString(name, "Name");
    checkProperString(postedBy, "User");
    checkProperArray(ingredients, "Ingredients");
    ingredients.forEach(element => {
      checkProperString(element, "Individual ingredient");
    });

    checkProperString(mealType, "Meal Type");
    checkProperString(cuisine, "Cuisine");

    checkProperString(instructions);

    checkProperObject(postedBy);

    const recipeCollection = await recipes();
    let newRecipe = {
      name: name,
      postedBy: postedBy,
      time: time,
      ingredients: ingredients,
      mealType: mealType,
      cuisine: cuisine,
      overallRating: 0,
      instructions: instructions,
      reviews: [],
    };

    const insertInfo = await recipeCollection.insertOne(newRecipe);
    if (insertInfo.insertedCount === 0) throw "Could not create a Recipe";

    const newId = insertInfo.insertedId.toString();
    const recipe = await this.get(newId);
    return recipe;
  },

  async get(id) {
    checkProperString(id, "Recipe ID");
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

  async getAll() {
    const recipeCollection = await recipes();

    const recipeList = await recipeCollection.find({}).toArray();
    const rstList = [];
    recipeList.forEach(item => {
      let obj = {};
      obj._id = item._id.toString();
      obj.name = item.name;
      rstList.push(obj);
    });

    return rstList;
  },

  async remove(id) {
    checkProperString(id, "Recipe ID");
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
    postedBy,
    time,
    ingredients,
    mealType,
    cuisine,
    instructions
  ) {
    checkProperString(name, "Name");
    checkProperString(postedBy, "User");
    checkProperArray(ingredients, "Ingredients");
    ingredients.forEach(element => {
      checkProperString(element, "Individual ingredient");
    });

    checkProperString(mealType, "Meal Type");
    checkProperString(cuisine, "Cuisine");

    checkProperArray(instructions);
    instructions.forEach(element => {
      checkProperString(element, "Individual Step");
    });

    checkProperObject(postedBy);

    const recipe = await this.get(id);
    let ID = ObjectId(id);

    let updatedRecipe = {
      name: name,
      postedBy: postedBy,
      time: time,
      ingredients: ingredients,
      mealType: mealType,
      cuisine: cuisine,
      overallRating: recipe.overallRating,
      instructions: instructions,
      reviews: recipe.reviews,
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

  async modifyingRatings(recipeId) {
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
        .map(s => s.rating)
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
            title: reviewobj.title,
            reviewer: reviewobj.reviewer,
            rating: reviewobj.rating,
            dateOfReview: reviewobj.dateOfReview,
            review: reviewobj.review,
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

//Helper Functions
const checkProperString = (string, parameter) => {
  if (string == null || typeof string == undefined)
    throw `Error: Please pass a ${parameter}`;
  if (typeof string != "string") {
    throw `Error: ${parameter} Not a string`;
  }
  string = string.trim();
  if (string.length == 0) {
    throw `Error: ${parameter} Empty string`;
  }
};

const isValidURL = string => {
  if (string.startsWith("http://www.") || string.startsWith("https://www.")) {
    if (/.([./])com$/.test(string)) {
      if (string.length < 20)
        throw "Error:  At least 5 characters in-between the http://www. and .com required ";
    }
  } else {
    throw "Error: Not valid Website";
  }
};

const checkProperArray = array => {
  if (!array) throw "Error: No parameter supplied. Please pass an array";
  if (!Array.isArray(array))
    throw `Error: Parameter passed, "${array}" is not an array.It is "${typeof array}". Please pass an array instead`;
  if (array.length == 0) throw "Cannot pass an empty array";
};

const checkProperObject = (object, checklength) => {
  if (!object) throw "Error: Please pass the object";
  if (!(object.constructor === Object)) {
    throw "Error: Parameter passed should be an object";
  }
  if (checklength && Object.keys(object).length === 0)
    throw "Error: Pass atleast 1 value in the object";
};
