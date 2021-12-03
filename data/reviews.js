const mongoCollections = require("../config/mongoCollections");
const recipeFunctions = require("./recipes.js");
const recipes = mongoCollections.recipes;
const reviews = mongoCollections.reviews;
const util = require("./util");
let { ObjectId } = require("mongodb");

module.exports = {
  async create(recipeId, rating, reviewText, userId) {
    util.checkProperString(recipeId, "Recipe ID");
    util.checkProperString(reviewText, "Review Text");
    util.checkProperString(userId, "User Id");

    if (!ObjectId.isValid(recipeId)) throw "Error: Not a valid ObjectId";
    // let ID = ObjectId(recipeId);

    const recipe = await recipeFunctions.get(recipeId);
    if (!recipe) {
      throw "Error: No recipe with that id";
    }

    util.checkProperNumber(rating, "Rating");
    if (rating < 1 || rating > 5)
      throw "Error: Rating value must be between 1 to 5";

    // util.checkProperDate(dateOfReview);

    const reviewCollection = await reviews();
    let newReview = {
      recipeId: ObjectId(recipeId),
      rating: rating,
      reviewText: reviewText,
      likes: [],
      dislikes: [],
      comments: [],
      userId: userId,
      dateOfReview: new Date()
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
    util.checkProperString(recipeId, "Recipe ID");
    if (!ObjectId.isValid(recipeId)) throw "Error: Not a valid ObjectId";
    // let ID = ObjectId(recipeId);

    const recipe = await recipeFunctions.get(recipeId);
    if (!recipe) {
      throw "Error: No recipe with that id";
    }
    const reviews = recipe.reviews;
    return reviews;
  },

  async get(id) {
    util.checkProperString(id, "Review ID");
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
    util.checkProperString(id, "Review ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);

    const review = await get(id);
    if (!review) {
      throw "Error: No review with that id";
    }

    const reviewCollection = await reviews();
    const recipeCollection = await recipes();
    const recipe = await recipeCollection.findOne({
      reviews: { $elemMatch: { _id: ID } },
    });
    const recipeID = recipe._id.toString();
    const deletionInfo = await reviewCollection.deleteOne({ _id: ID });

    if (deletionInfo.deletedCount === 0) {
      throw `Error: Could not delete review with id of ${ID}`;
    }

    await recipeFunctions.removeReviewFromRecipe(recipeID, ID);
    await recipeFunctions.modifyingRatings(recipeID);

    return { reviewId: id, deleted: true };
  },

  async addCommentToReview(reviewId, commentId, commentobj) {
    if (!ObjectId.isValid(reviewId)) throw "Error: Not a valid ObjectId";
    let reviewID = ObjectId(reviewId);

    if (!ObjectId.isValid(commentId)) throw "Error: Not a valid ObjectId";
    let commentID = ObjectId(commentId);

    let currentReview = await get(reviewId);
    if (!currentReview) {
      throw "Error: No review with that id";
    }

    const reviewCollection = await reviews();
    const updateInfo = await reviewCollection.updateOne(
      { _id: reviewID },
      {
        $push: {
          comments: {
            _id: commentID,
            userId: commentobj.userId,
            comment: commentobj.comment,
            dateOfComment: commentobj.dateOfComment
          },
        },
      }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed at adding comment to review";

    return await this.get(reviewId);
  },

  async removeCommentFromReview(reviewId, commentId) {
    if (!ObjectId.isValid(reviewId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(reviewId);

    if (!ObjectId.isValid(commentId)) throw "Error: Not a valid ObjectId";
    let commentID = ObjectId(commentId);

    let currentReview = await get(reviewId);
    if (!currentReview) {
      throw "Error: No review with that id";
    }

    const reviewCollection = await reviews();
    const updateInfo = await reviewCollection.updateOne(
      { _id: ID },
      { $pull: { comments: { _id: commentID } } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Error: Update failed while removing comment from review";

    return await get(reviewId);
  }
};