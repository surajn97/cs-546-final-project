const dbConnection = require("../config/mongoConnection");
// const data = require("../data/");
const testData = require("../data/").test;
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const ingredients = mongoCollections.ingredients;
const recipes = mongoCollections.recipes;
const reviews = mongoCollections.reviews;
const comments = mongoCollections.comments;


const main = async () => {
  if (dbConnection.env != 'production') {
    const db = await dbConnection.connectToDb();
    await db.dropDatabase();
    try {
      const usersCollection = await users();
      const ingredientsCollection = await ingredients();
      const recipesCollection = await recipes();
      const reviewsCollection = await reviews();
      const commentsCollection = await comments();

      await usersCollection.insertOne(testData.userobj);
      await ingredientsCollection.insertOne(testData.ingredientObj);
      await recipesCollection.insertOne(testData.recipeobj);
      await reviewsCollection.insertOne(testData.reviewObj);
      await commentsCollection.insertOne(testData.commentObj);
    } catch (err) {
      throw err
    }
    console.log('Done seeding ' + dbConnection.env + ' database');
    dbConnection.closeConnection();
  }
};

main().catch(console.log);