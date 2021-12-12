const mongoCollections = require("../config/mongoCollections");
const ingredients = mongoCollections.ingredients;
let { ObjectId } = require("mongodb");
const helper = require("./helper");

function convertIngredientsToCategories(ingredientList) {
  helper.checkProperArrayAllowEmpty(ingredientList);
  const categories = [...new Set(ingredientList.map(item => item.category))];
  let categorizedIngredients = {};
  for (const category of categories) {
    categorizedIngredients[category] = ingredientList
      .filter(x => x.category === category)
      .map(y => ({
        name: y.name,
        _id: y._id.toString(),
        protien: y.protien,
        carb: y.carb,
        fat: y.fat,
        calories: y.calories,
        checked: y.checked,
      }));
  }
  return categorizedIngredients;
}

function getCalories(p, c, f) {
  helper.checkProperNumber(p);
  helper.checkProperNumber(c);
  helper.checkProperNumber(f);
  if (p < 0 || c < 0 || f < 0) throw "Nutritional info cannot be negative";
  const calories = p * 4 + c * 4 + f * 9;
  return Math.round(calories * 100) / 100;
}

module.exports = {
  async create(name, category, protien, carb, fat) {
    helper.checkProperString(name, "Ingredient Name");
    helper.checkProperString(category, "Ingredient Category");
    helper.checkProperNumber(protien, "Protien");
    helper.checkProperNumber(carb, "Carbs");
    helper.checkProperNumber(fat, "Fats");
    if (protien < 0 || carb < 0 || fat < 0)
      throw "Nutritional info cannot be negative";
    const ingredientCollection = await ingredients();
    let newIngredient = {
      name: name,
      category: category,
      protien: protien,
      carb: carb,
      fat: fat,
      userGenerated: false,
    };
    const insertInfo = await ingredientCollection.insertOne(newIngredient);
    if (!insertInfo.acknowledged)
      throw `Could not create the Ingredient ${name}`;
    const newId = insertInfo.insertedId.toString();
    const ingredient = await this.get(newId);
    return ingredient;
  },

  async createByUser(name, category) {
    helper.checkProperString(name, "Ingredient Name");
    helper.checkProperString(category, "Ingredient Category");
    const ingredientCollection = await ingredients();
    name = name.toLowerCase();
    name = name.charAt(0).toUpperCase() + name.slice(1);

    let newIngredient = {
      name: name,
      category: category,
      protien: 0,
      carb: 0,
      fat: 0,
      userGenerated: true,
    };
    const insertInfo = await ingredientCollection.insertOne(newIngredient);
    if (insertInfo.insertedCount === 0)
      throw `Could not create the Ingredient ${name}`;
    const newId = insertInfo.insertedId.toString();
    const ingredient = await this.get(newId);
    return ingredient;
  },

  async checkIfIngredientExists(name, category) {
    helper.checkProperString(name, "Ingredient Name");
    helper.checkProperString(category, "Ingredient Category");
    const ingredientCollection = await ingredients();
    const result = await ingredientCollection
      .find({
        name: { $regex: name, $options: "i" },
        category: category,
      })
      .toArray();
    return {
      exists: result.length == 0,
      matches: result,
    };
  },

  async searchIngredient(name) {
    helper.checkProperString(name, "Ingredient Name");
    const ingredientCollection = await ingredients();
    const result = await ingredientCollection
      .find({
        name: { $regex: name, $options: "i" },
      })
      .toArray();
    return convertIngredientsToCategories(result);
  },

  async getByName(name) {
    helper.checkProperString(name);
    name = name.toLowerCase();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    const ingredientCollection = await ingredients();
    const ingredient = await ingredientCollection.findOne({
      name: name,
    });
    if (ingredient === null) {
      return "Not found";
    }
    ingredient._id = ingredient._id.toString();
    ingredient.calories = getCalories(
      ingredient.protien,
      ingredient.carb,
      ingredient.fat
    );
    return ingredient;
  },

  async get(id) {
    let ID = helper.checkAndGetID(id);
    const ingredientCollection = await ingredients();
    const ingredient = await ingredientCollection.findOne({ _id: ID });
    if (ingredient === null) {
      throw "Error: No ingredient with that id";
    }
    ingredient._id = ingredient._id.toString();
    ingredient.calories = getCalories(
      ingredient.protien,
      ingredient.carb,
      ingredient.fat
    );
    return ingredient;
  },

  async getAll() {
    const ingredientCollection = await ingredients();
    const ingredientList = await ingredientCollection.find({}).toArray();
    ingredientList.forEach(function (ingredient) {
      ingredient.calories = getCalories(
        ingredient.protien,
        ingredient.carb,
        ingredient.fat
      );
      ingredient.checked = false;
    });
    return convertIngredientsToCategories(ingredientList);
  },

  async getAllWithChecked(checkedIngredients) {
    helper.checkProperArray(checkedIngredients);
    const ingredientCollection = await ingredients();
    const ingredientList = await ingredientCollection.find({}).toArray();
    ingredientList.forEach(function (ingredient) {
      ingredient.calories = getCalories(
        ingredient.protien,
        ingredient.carb,
        ingredient.fat
      );
      if (checkedIngredients.includes(ingredient._id.toString()))
        ingredient.checked = true;
      else ingredient.checked = false;
    });
    return convertIngredientsToCategories(ingredientList);
  },

  async remove(id) {
    let ID = helper.checkProperObject(id);
    const ingredientCollection = await ingredients();
    const deletionInfo = await ingredientCollection.deleteOne({ _id: ID });

    if (deletionInfo.deletedCount === 0) {
      throw `Error: Could not delete ingredient with id of ${ID}`;
    }
    return { ingredientId: id, deleted: true };
  },

  async update(id, name, category, protien, carb, fat) {
    helper.checkProperString(name, "Ingredient Name");
    helper.checkProperString(category, "Ingredient Category");
    helper.checkProperNumber(protien, "Ingredient Protien");
    helper.checkProperNumber(carb, "Ingredient Carb");
    helper.checkProperNumber(fat, "Ingredient fat");
    if (protien < 0 || carb < 0 || fat < 0)
      throw "Nutritional info cannot be negative";
    let ID = helper.checkProperObject(id);
    let updatedIngredient = {
      name: name,
      category: category,
      protien: protien,
      carb: carb,
      fat: fat,
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
};
