const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require("mongodb");
const { users } = require(".");

module.exports = {
  async create(firstName, lastName, email, username, age, hashPassword) {
    checkProperString(firstName, "First Name");
    checkProperString(lastName, "Last Name");
    checkProperString(username, "username");
    checkProperString(email, "email");
    checkProperNumber(age, "Age");
    checkProperNumber(hashPassword, "hashPassword");

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
    checkProperString(id, "User ID");
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
    userList.forEach(item => {
      let obj = {};
      obj._id = item._id.toString();
      obj.name = item.name;
      rstList.push(obj);
    });

    return rstList;
  },

  async remove(id) {
    checkProperString(id, "User ID");
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
    checkProperString(name, "Name");
    checkProperString(postedBy, "User");
    checkProperArray(ingredients, "Ingredients");
    ingredients.forEach(element => {
      checkProperString(element, "Individual ingredient");
    });

    checkProperString(mealType, "Meal Type");
    checkProperString(cuisine, "Cuisine");

    checkProperArray(method);
    method.forEach(element => {
      checkProperString(element, "Individual Step");
    });

    checkProperObject(postedBy);

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
        .map(s => s.rating)
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
