const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const testData = require("../data/").test;
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const ingredients = mongoCollections.ingredients;
const recipes = mongoCollections.recipes;
const reviews = mongoCollections.reviews;
const comments = mongoCollections.comments;
const ingredientsData = data.ingredients;

// const reviews = data.reviews;

const main = async () => {
  if (dbConnection.env != "production") {
    const db = await dbConnection.connectToDb();
    await db.dropDatabase();
    try {
      const usersCollection = await users();
      const ingredientsCollection = await ingredients();
      const recipesCollection = await recipes();
      const reviewsCollection = await reviews();
      const commentsCollection = await comments();
      await usersCollection.insertOne(testData.userobj);
      let igList = [];
      for (const ig in testData.ingredientObjs) {
        for (const ingredient in testData.ingredientObjs[ig]) {
          igList.push(
            await ingredientsData.create(
              ingredient,
              ig,
              testData.ingredientObjs[ig][ingredient].p,
              testData.ingredientObjs[ig][ingredient].c,
              testData.ingredientObjs[ig][ingredient].f
            )
          );
        }
      }
      const recipeobj = [
        {
          name: "Cauliflower rice",
          postedBy: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
          cookingTime: "10",
          mealType: "Lunch",
          cuisine: "French Cuisine",
          ingredients: [
            {
<<<<<<< HEAD
              _id: igList.find(x => x.name.toLowerCase() == "cauliflower")._id,
=======
              _id: igList.find((x) => x.name.toLowerCase() == "cauliflower")
                ._id,
>>>>>>> main
              quantity: 3,
              quantityMeasure: "teaspoons",
            },
            {
<<<<<<< HEAD
              _id: igList.find(x => x.name.toLowerCase() == "rice")._id,
=======
              _id: igList.find((x) => x.name.toLowerCase() == "rice")._id,
>>>>>>> main
              quantity: 4,
              quantityMeasure: "grams",
            },
          ],
          instructions:
            "Easy rice-like side dish that's much lower GI and ready in just 10 minutes",
          reviews: [
            "9vd99ce2-c0d2-4f8c-b27a-6a1d4b5b5063",
            "695d97a2-c0d2-4f8c-b27a-6a1d4b5b6927",
          ],
          overallRating: 4,
          servings: 8,
        },
      ];

      await recipesCollection.insertMany(recipeobj);
      await reviewsCollection.insertOne(testData.reviewObj);
      await commentsCollection.insertOne(testData.commentObj);
    } catch (err) {
      throw err;
    }
    console.log("Done seeding " + dbConnection.env + " database");
    dbConnection.closeConnection();
    // await db.serverConfig.close();
  }
  // };

  // main().catch(console.log);
  // console.log("Done seeding database");
};

main().catch((error) => {
  console.log(error);
});
