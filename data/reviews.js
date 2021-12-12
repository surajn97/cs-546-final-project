const mongoCollections = require("../config/mongoCollections");
const recipeFunctions = require("./recipes.js");
const userFunctions = require("./users");
const recipes = mongoCollections.recipes;
const reviews = mongoCollections.reviews;
// for add to user
const users = mongoCollections.users;
const Sentiment = require("sentiment");

let { ObjectId } = require("mongodb");
const helper = require("./helper");

module.exports = {
  async create(recipeId, rating, reviewText, userId) {
    helper.checkProperString(recipeId, "Recipe ID");
    helper.checkProperString(reviewText, "Review Text");
    helper.checkProperString(userId, "User Id");

    if (!ObjectId.isValid(recipeId)) throw "Error: Not a valid ObjectId";
    // let ID = ObjectId(recipeId);

    const recipe = await recipeFunctions.get(recipeId);
    if (!recipe) {
      throw "Error: No recipe with that id";
    }

    try {
      rating = parseInt(rating);
    } catch (e) {
      throw "Error: Rating is not a number";
    }
    helper.checkProperNumber(rating, "Rating");
    if (rating < 1 || rating > 5)
      throw "Error: Rating value must be between 1 to 5";

    // helper.checkProperDate(dateOfReview);
    const user = await userFunctions.get(userId);

    const reviewCollection = await reviews();
    let newReview = {
      recipeId: ObjectId(recipeId),
      rating: rating,
      reviewText: reviewText,
      likes: [],
      dislikes: [],
      comments: [],
      user: user,
      dateOfReview: new Date(),
    };

    const insertInfo = await reviewCollection.insertOne(newReview);
    if (insertInfo.insertedCount === 0) throw "Could not create a Review";

    const newId = insertInfo.insertedId.toString();

    //Add the review id to the user
    const objIdForUser = ObjectId.createFromHexString(userId);
    const usersCollection = await users();
    const updatedInfo2 = await usersCollection.updateOne(
      { _id: objIdForUser },
      { $push: { myReviews: String(newReview._id) } }
    );
    if (updatedInfo2.modifiedCount === 0) {
      throw "Could not update Users Collection with Review Data!";
    }
    /////////

    const reviewobj = await this.get(newId);
    await recipeFunctions.addReviewToRecipe(recipeId, newId, reviewobj);
    await recipeFunctions.modifyingRatings(recipeId);
    return reviewobj;
  },

  async getAll(recipeId) {
    helper.checkProperString(recipeId, "Recipe ID");
    var sentiment = new Sentiment();
    if (!ObjectId.isValid(recipeId)) throw "Error: Not a valid ObjectId";
    // let ID = ObjectId(recipeId);

    const recipe = await recipeFunctions.get(recipeId);
    if (!recipe) {
      throw "Error: No recipe with that id";
    }
    const reviewsList = recipe.reviews;
    if (!reviewsList) throw "Error: No reviews found for recipe";
    let reviews_likes_added = [];
    for (let review of reviewsList) {
      review["total_likes"] =
        parseInt(review.likes.length) - parseInt(review.dislikes.length);
      let sentiScore = sentiment.analyze(review["reviewText"]).score;
      console.log(
        "sentiment score for" + review["reviewText"] + ": " + sentiScore
      );
      if (sentiScore < -6) {
        review["reviewSentiment"] = "Strong Negetive";
      } else if (sentiScore < -2) {
        review["reviewSentiment"] = "Negetive";
      } else if (sentiScore > 2) {
        review["reviewSentiment"] = "Positive";
      } else if (sentiScore > 6) {
        review["reviewSentiment"] = "Strong Positive";
      } else {
        review["reviewSentiment"] = "Neutral";
      }
      reviews_likes_added.push(review);
    }
    return reviews_likes_added;
  },

  async get(id) {
    helper.checkProperString(id, "Review ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);
    const reviewCollection = await reviews();

    const review = await reviewCollection.findOne({
      _id: ID,
    });
    if (review === null) {
      throw "Error: No review with that id";
    }
    review._id = review._id.toString();
    return review;
  },

  async getAllByUser(id) {
    helper.checkProperString(id, "User ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);
    const reviewCollection = await reviews();

    const reviewsList = await reviewCollection
      .find({
        "user._id": id,
      })
      .toArray();
    if (!reviewsList) {
      throw "Error: No review with that user id";
    }
    return reviewsList;
  },

  async remove(id) {
    helper.checkProperString(id, "Review ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);

    const review = await this.get(id);
    if (!review) {
      throw "Error: No review with that id";
    }

    const reviewCollection = await reviews();
    const recipeCollection = await recipes();
    const recipe = await recipeCollection.findOne({
      reviews: {
        $elemMatch: {
          _id: ID,
        },
      },
    });
    const recipeID = recipe._id.toString();
    const deletionInfo = await reviewCollection.deleteOne({
      _id: ID,
    });

    if (deletionInfo.deletedCount === 0) {
      throw `Error: Could not delete review with id of ${ID}`;
    }

    await recipeFunctions.removeReviewFromRecipe(recipeID, ID);
    await recipeFunctions.modifyingRatings(recipeID);

    return {
      reviewId: id,
      deleted: true,
    };
  },

  async addCommentToReview(reviewId, commentId, commentobj) {
    if (!ObjectId.isValid(reviewId)) throw "Error: Not a valid ObjectId";
    let reviewID = ObjectId(reviewId);

    if (!ObjectId.isValid(commentId)) throw "Error: Not a valid ObjectId";
    let commentID = ObjectId(commentId);

    let currentReview = await this.get(reviewId);
    if (!currentReview) {
      throw "Error: No review with that id";
    }

    const reviewCollection = await reviews();
    const updateInfo = await reviewCollection.updateOne(
      {
        _id: reviewID,
      },
      {
        $push: {
          comments: {
            _id: commentID,
            userId: commentobj.userId,
            name: commentobj.name,
            comment: commentobj.comment,
            dateOfComment: commentobj.dateOfComment,
          },
        },
      }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed at adding comment to review";

    return await this.get(reviewId);
  },

  async addLikeToReview(reviewId, userId) {
    if (!ObjectId.isValid(reviewId)) throw "Error: Not a valid ObjectId";
    let reviewID = ObjectId(reviewId);

    if (!ObjectId.isValid(userId)) throw "Error: Not a valid ObjectId";
    let userID = ObjectId(userId);

    let currentReview = await this.get(reviewId);
    if (!currentReview) {
      throw "Error: No review with that id";
    }

    if (currentReview.likes.includes(userId)) {
      throw "You already liked this review";
    }

    const reviewCollection = await reviews();
    const updateInfo = await reviewCollection.updateOne(
      {
        _id: reviewID,
      },
      {
        $push: {
          likes: userId,
        },
      }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed at adding like to review";

    const updatedReview = await this.get(reviewId);
    await recipeFunctions.replaceReviewInRecipe(
      updatedReview.recipeId.toString(),
      updatedReview
    );

    return updatedReview;
  },

  async addDislikeToReview(reviewId, userId) {
    if (!ObjectId.isValid(reviewId)) throw "Error: Not a valid ObjectId";
    let reviewID = ObjectId(reviewId);

    if (!ObjectId.isValid(userId)) throw "Error: Not a valid ObjectId";
    let userID = ObjectId(userId);

    let currentReview = await this.get(reviewId);
    if (!currentReview) {
      throw "Error: No review with that id";
    }

    if (currentReview.dislikes.includes(userId)) {
      throw "You already disliked this review";
    }

    const reviewCollection = await reviews();
    const updateInfo = await reviewCollection.updateOne(
      {
        _id: reviewID,
      },
      {
        $push: {
          dislikes: userId,
        },
      }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed at adding dislike to review";

    const updatedReview = await this.get(reviewId);
    await recipeFunctions.replaceReviewInRecipe(
      updatedReview.recipeId.toString(),
      updatedReview
    );

    return updatedReview;
  },

  async removeCommentFromReview(reviewId, commentId) {
    if (!ObjectId.isValid(reviewId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(reviewId);

    if (!ObjectId.isValid(commentId)) throw "Error: Not a valid ObjectId";
    let commentID = ObjectId(commentId);

    let currentReview = await this.get(reviewId);
    if (!currentReview) {
      throw "Error: No review with that id";
    }

    const reviewCollection = await reviews();
    const updateInfo = await reviewCollection.updateOne(
      {
        _id: ID,
      },
      {
        $pull: {
          comments: {
            _id: commentID,
          },
        },
      }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Error: Update failed while removing comment from review";

    return await this.get(reviewId);
  },
};
