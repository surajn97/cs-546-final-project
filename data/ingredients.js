const mongoCollections = require("../config/mongoCollections");
const ingredients = mongoCollections.ingredients;
let { ObjectId } = require("mongodb");
const { users } = require(".");
const helper = require("helper");

module.exports = {
  async create(name) {
    helper.checkProperString(name, "Name");
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
    helper.checkProperString(id, "Ingredient ID");
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
    ingredientList.forEach((item) => {
      let obj = {};
      obj._id = item._id.toString();
      obj.name = item.name;
      ingList.push(obj);
    });

    return ingList;
  },

  async remove(id) {
    helper.checkProperString(id, "Ingredient ID");
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
    helper.checkProperString(name, "Name");
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
