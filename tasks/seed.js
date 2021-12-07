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
      const userInfo = await usersCollection.insertOne(testData.userobj);
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
          postedBy: userInfo.insertedId.toString(),
          cookingTime: "10",
          mealType: "Lunch",
          cuisine: "French",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "cauliflower")
                ._id,
              quantity: 3,
              quantityMeasure: "teaspoons",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "rice")._id,
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
        {
          name: "Cauliflower Mac and Cheese",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: "50",
          mealType: "Snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "butter")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "cauliflower")
                ._id,
              quantity: 3,
              quantityMeasure: "cups",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "milk")._id,
              quantity: 3,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "mustard")._id,
              quantity: 0.5,
              quantityMeasure: "teaspoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "parmesan")._id,
              quantity: 0.25,
              quantityMeasure: "up",
            },
          ],
          instructions:
            "Bring a large pot of salted water to a boil. Preheat the oven to 375 degrees F. Grease a baking dish with butter. Cook the cauliflower in the boiling water until just crisp-tender, about 10 minutes. Drain well. In a large saucepan, heat the milk and butter over medium heat. Whisk in the dry mustard and add some hot sauce, salt and pepper. Just before the milk comes to a boil, turn off the heat and stir in the pepper jack and goat cheese. When melted and smooth, stir in the cauliflower. Spread the mixture into the prepared baking dish and sprinkle over the Parmesan. Bake until the top is golden brown and the mixture is bubbling, about 30 minutes. Let rest for a few minutes before serving.",
          reviews: [
            "9vd99ce2-c0d2-4f8c-b27a-6a1d4b5b5063",
            "695d97a2-c0d2-4f8c-b27a-6a1d4b5b6927",
          ],
          overallRating: 4.3,
          servings: 4,
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
