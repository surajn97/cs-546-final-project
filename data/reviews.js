const mongoCollections = require("../config/mongoCollections");
const recipeFunctions = require("./recipes.js");
const recipes = mongoCollections.recipes;
const reviews = mongoCollections.reviews;
let { ObjectId } = require("mongodb");

module.exports = {
  async create(recipeId, title, reviewer, rating, dateOfReview, review) {
    checkProperString(recipeId, "Recipe ID");
    checkProperString(title, "Title");
    checkProperString(reviewer, "Reviewer");
    checkProperString(dateOfReview, "Date of Review");
    checkProperString(review, "review");

    if (!ObjectId.isValid(recipeId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(recipeId);

    const recipe = await recipeFunctions.get(recipeId);
    if (!recipe) {
      throw "Error: No recipe with that id";
    }

    checkProperNumber(rating, "Rating");
    if (rating < 1 || rating > 5)
      throw "Error: Rating value must be between 1 to 5";

    checkProperDate(dateOfReview);

    const reviewCollection = await reviews();
    let newReview = {
      title: title,
      reviewer: reviewer,
      rating: rating,
      dateOfReview: dateOfReview,
      review: review,
    };

    const insertInfo = await reviewCollection.insertOne(newReview);
    if (insertInfo.insertedCount === 0) throw "Could not create a Review";

    const newId = insertInfo.insertedId.toString();

    const reviewobj = await this.get(newId);
    await recipeFunctions.addReviewToRecipe(recipeId, newId, reviewobj);
    const modRest = await recipeFunctions.modifyingRatings(recipeId);
    return modRest;
  },

  async getAll(recipeId) {
    checkProperString(recipeId, "Recipe ID");
    if (!ObjectId.isValid(recipeId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(recipeId);

    const recipe = await recipeFunctions.get(recipeId);
    const reviews = recipe.reviews;

    return reviews;
  },

  async get(id) {
    checkProperString(id, "Review ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);
    const reviewCollection = await reviews();

    const review = await reviewCollection.findOne({ _id: ID });
    if (review === null) {
      throw "Error: No review with that id";
    }
    review._id = review._id.toString();
    return review;
  },

  async remove(id) {
    checkProperString(id, "Review ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);

    const review = await this.get(id);

    const reviewCollection = await reviews();
    const recipeCollection = await recipes();
    const rest = await recipeCollection.findOne({
      reviews: { $elemMatch: { _id: ID } },
    });
    const restID = rest._id.toString();
    const deletionInfo = await reviewCollection.deleteOne({ _id: ID });

    if (deletionInfo.deletedCount === 0) {
      throw `Error: Could not delete review with id of ${ID}`;
    }

    await recipeFunctions.removeReviewFromRecipe(restID, ID);
    await recipeFunctions.modifyingRatings(restID);

    return { reviewId: id, deleted: true };
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

const checkProperNumber = (num, parameter) => {
  if (num == null || typeof num == undefined)
    throw `Error: No ${parameter} Passed. Please pass a number`;
  if (typeof num !== "number")
    throw `Error: Please pass a number for ${parameter}`;
  if (isNaN(num)) throw `Error: ${parameter} is not a number`;
};

const checkProperDate = dor => {
  let checkdate = new Date(dor);
  let dorArray = dor.split("/");
  let month = parseInt(dorArray[0], 10);
  let date = parseInt(dorArray[1], 10);
  let year = checkdate.getFullYear();
  if (month <= 0) throw "Error: Month cant be negetive";
  if (month > 12) throw "Error: Month > 12";

  if (!/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dor)) {
    throw "Error: Date of Review should be in this format: MM/DD/YYYY";
  }
  if (year < 1000 || year > 3000) {
    throw "Error: Enter Valid year in Date of Review ";
  }
  var monthDaysArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
    monthDaysArray[1] = 29;
  }
  if (date < 0 || date > monthDaysArray[month - 1]) {
    throw "Date of Review should be in this format: MM/DD/YYYY";
  }
};
