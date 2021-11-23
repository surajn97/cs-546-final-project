const mongoCollections = require("../config/mongoCollections");
const ingredients = mongoCollections.ingredients;
let { ObjectId } = require("mongodb");
const { users } = require(".");

module.exports = {
  async create(name) {
    checkProperString(name, "Name");
    const ingredientCollection = await ingredients();
    let newIngredient = {
      name: name,
    };
    const insertInfo = await ingredientCollection.insertOne(newIngredient);
    if (insertInfo.insertedCount === 0) throw "Could not create a Ingredient";
    const newId = insertInfo.insertedId.toString();
    const ingredient = await this.get(newId);
    return ingredient;
  },

  async get(id) {
    checkProperString(id, "Ingredient ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);
    const ingredientCollection = await ingredients();

    const ingredient = await ingredientCollection.findOne({ _id: ID });
    if (ingredient === null) {
      throw "Error: No ingredient with that id";
    }
    ingredient._id = ingredient._id.toString();
    return ingredient;
  },

  async getAll() {
    const ingredientCollection = await ingredients();

    const ingredientList = await ingredientCollection.find({}).toArray();
    const ingList = [];
    ingredientList.forEach(item => {
      let obj = {};
      obj._id = item._id.toString();
      obj.name = item.name;
      ingList.push(obj);
    });

    return ingList;
  },

  async remove(id) {
    checkProperString(id, "Ingredient ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);

    const ingredientCollection = await ingredients();

    const deletionInfo = await ingredientCollection.deleteOne({ _id: ID });

    if (deletionInfo.deletedCount === 0) {
      throw `Error: Could not delete ingredient with id of ${ID}`;
    }
    return { ingredientId: id, deleted: true };
  },

  async update(id, name) {
    checkProperString(name, "Name");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";

    const ingredient = await this.get(id);
    let ID = ObjectId(id);

    let updatedIngredient = {
      name: name,
    };

    const ingredientCollection = await ingredients();
    const updateInfo = await ingredientCollection.updateOne(
      { _id: ID },
      { $set: updatedIngredient }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    const ingredientn = await this.get(id);

    return ingredientn;
  },

  async modifyingNuValue(ingredientId) {
    //
  },

  async addNuValue(ingredientId, reviewId, reviewobj) {
    //add Nu Value
  },

  async removeNuValue(ingredientId, reviewId) {
    //remove nuValue
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
