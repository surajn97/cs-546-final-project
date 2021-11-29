const mongoCollections = require("../config/mongoCollections");
const restaurantFunctions = require("./recipes.js");
const restaurants = mongoCollections.restaurants;
const reviews = mongoCollections.reviews;
let { ObjectId } = require("mongodb");
const helper = require("helper");

module.exports = {
  async create(restaurantId, title, reviewer, rating, dateOfReview, review) {
    helper.checkProperString(restaurantId, "Restaurant ID");
    helper.checkProperString(title, "Title");
    helper.checkProperString(reviewer, "Reviewer");
    helper.checkProperString(dateOfReview, "Date of Review");
    helper.checkProperString(review, "review");

    if (!ObjectId.isValid(restaurantId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(restaurantId);

    const restaurant = await restaurantFunctions.get(restaurantId);
    if (!restaurant) {
      throw "Error: No restaurant with that id";
    }

    helper.checkProperNumber(rating, "Rating");
    if (rating < 1 || rating > 5)
      throw "Error: Rating value must be between 1 to 5";

    helper.checkProperDate(dateOfReview);

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
    await restaurantFunctions.addReviewToRestaurant(
      restaurantId,
      newId,
      reviewobj
    );
    const modRest = await restaurantFunctions.modifyingRatings(restaurantId);
    return modRest;
  },

  async getAll(restaurantId) {
    helper.checkProperString(restaurantId, "Restaurant ID");
    if (!ObjectId.isValid(restaurantId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(restaurantId);

    const restaurant = await restaurantFunctions.get(restaurantId);
    const reviews = restaurant.reviews;

    return reviews;
  },

  async get(id) {
    helper.checkProperString(id, "Review ID");
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
    helper.checkProperString(id, "Review ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);

    const review = await this.get(id);

    const reviewCollection = await reviews();
    const restaurantCollection = await restaurants();
    const rest = await restaurantCollection.findOne({
      reviews: { $elemMatch: { _id: ID } },
    });
    const restID = rest._id.toString();
    const deletionInfo = await reviewCollection.deleteOne({ _id: ID });

    if (deletionInfo.deletedCount === 0) {
      throw `Error: Could not delete review with id of ${ID}`;
    }

    await restaurantFunctions.removeReviewFromRestaurant(restID, ID);
    await restaurantFunctions.modifyingRatings(restID);

    return { reviewId: id, deleted: true };
  },
};
