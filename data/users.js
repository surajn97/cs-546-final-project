const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require("mongodb");
const { users } = require(".");
const helper = require("helper");

module.exports = {
  async create(firstName, lastName, email, username, age, hashPassword) {
    helper.checkProperString(firstName, "First Name");
    helper.checkProperString(lastName, "Last Name");
    helper.checkProperString(username, "username");
    helper.checkProperString(email, "email");
    helper.checkProperNumber(age, "Age");
    helper.checkProperNumber(hashPassword, "hashPassword");

    const userCollection = await users();
    let newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      age: age,
      hashPassword: hashPassword,
      myFavoriteRecipe: [],
      myRecipes: [],
      myReviews: [],
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw "Could not create a User";

    const newId = insertInfo.insertedId.toString();
    const user = await this.get(newId);
    return user;
  },

  async get(id) {
    helper.checkProperString(id, "User ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);
    const userCollection = await users();

    const user = await userCollection.findOne({ _id: ID });
    if (user === null) {
      throw "Error: No user with that id";
    }
    user._id = user._id.toString();
    return user;
  },

  async getAll() {
    const userCollection = await users();

    const userList = await userCollection.find({}).toArray();
    const rstList = [];
    userList.forEach((item) => {
      let obj = {};
      obj._id = item._id.toString();
      obj.name = item.name;
      rstList.push(obj);
    });

    return rstList;
  },

  async remove(id) {
    helper.checkProperString(id, "User ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);

    const userCollection = await users();

    const deletionInfo = await userCollection.deleteOne({ _id: ID });

    if (deletionInfo.deletedCount === 0) {
      throw `Error: Could not delete user with id of ${ID}`;
    }
    return { userId: id, deleted: true };
  },

  async update(
    id,
    name,
    postedBy,
    time,
    ingredients,
    mealType,
    cuisine,
    method
  ) {
    helper.checkProperString(name, "Name");
    helper.checkProperString(postedBy, "User");
    helper.checkProperArray(ingredients, "Ingredients");
    ingredients.forEach((element) => {
      helper.checkProperString(element, "Individual ingredient");
    });

    helper.checkProperString(mealType, "Meal Type");
    helper.checkProperString(cuisine, "Cuisine");

    helper.checkProperArray(method);
    method.forEach((element) => {
      helper.checkProperString(element, "Individual Step");
    });

    helper.checkProperObject(postedBy);

    const user = await this.get(id);
    let ID = ObjectId(id);

    let updatedUser = {
      name: name,
      postedBy: postedBy,
      time: time,
      ingredients: ingredients,
      mealType: mealType,
      cuisine: cuisine,
      overallRating: user.overallRating,
      method: method,
      reviews: user.reviews,
    };

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: ID },
      { $set: updatedUser }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    const usern = await this.get(id);

    return usern;
  },

  async modifyingRatings(userId) {
    if (!ObjectId.isValid(userId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(userId);
    let currentUser = await this.get(userId);
    let newRating = currentUser.overallRating;
    const len = currentUser.reviews.length;
    if (len == 0) {
      newRating = 0;
    } else {
      let currentUser = await this.get(userId);
      const reviewsarray = currentUser.reviews;
      let sumRating = reviewsarray
        .map((s) => s.rating)
        .reduce((a, b) => a + b, 0);
      newRating = sumRating / len;
    }
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: ID },
      { $set: { overallRating: newRating } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed at modifying rating of the user";

    return await this.get(userId);
  },

  async addReviewToUser(userId, reviewId, reviewobj) {
    if (!ObjectId.isValid(userId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(userId);

    if (!ObjectId.isValid(reviewId)) throw "Error: Not a valid ObjectId";
    let reviewID = ObjectId(reviewId);

    let currentUser = await this.get(userId);
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
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
      throw "Update failed at adding review to user";

    return await this.get(userId);
  },

  async removeReviewFromUser(userId, reviewId) {
    if (!ObjectId.isValid(userId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(userId);

    if (!ObjectId.isValid(reviewId)) throw "Error: Not a valid ObjectId";
    let reviewID = ObjectId(reviewId);

    let currentUser = await this.get(userId);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: ID },
      { $pull: { reviews: { _id: reviewID } } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Error: Update failed while removing review from user";

    return await this.get(userId);
  },
};
