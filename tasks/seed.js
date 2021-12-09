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
const recipesData = data.recipes;

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
      const userObj = await usersCollection.findOne({_id: userInfo.insertedId});
      testData.commentObj["userId"] = userObj._id;
      const commentInfo = await commentsCollection.insertOne(testData.commentObj);
      const commentObj = await commentsCollection.findOne({_id: commentInfo.insertedId});
      testData.reviewObj["comments"] = [commentObj];
      testData.reviewObj["likes"] = [userObj._id.toString()];
      testData.reviewObj["dislikes"] = [userObj._id.toString()];
      testData.reviewObj["user"] = userObj;
      const reviewInfo = await reviewsCollection.insertOne(testData.reviewObj);
      const reviewObj = await reviewsCollection.findOne({_id: reviewInfo.insertedId});

      let igList = [];
      console.log("Creating Ingredients:");
      for (const ig in testData.ingredientObjs) {
        let keys = Object.keys(testData.ingredientObjs[ig]),
          i,
          len = keys.length;
        keys.sort();
        for (const ingredient of keys) {
          igList.push(
            await ingredientsData.create(
              ingredient.toLowerCase(),
              ig,
              testData.ingredientObjs[ig][ingredient].p,
              testData.ingredientObjs[ig][ingredient].c,
              testData.ingredientObjs[ig][ingredient].f
            )
          );
        }
      }
      console.log("Completed Adding Ingredients!");
      console.log(
        "Creating Recipes... This might take a while as it is fetching images from google"
      );
      const recipeArr = [
        {
          name: "Cauliflower Rice",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: "25",
          mealType: "Lunch",
          cuisine: "French",
          ingredients: [
            {
              id: igList.find(x => x.name.toLowerCase() == "cauliflower")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
          ],
          //   {
          //     id: igList.find(x => x.name.toLowerCase() == "olive oil")._id,
          //     quantity: 3,
          //     quantityMeasure: "tablespoon",
          //   },
          //   {
          //     id: igList.find(x => x.name.toLowerCase() == "onion")._id,
          //     quantity: 1,
          //     quantityMeasure: "qty",
          //   },
          //   {
          //     id: igList.find(x => x.name.toLowerCase() == "parsley")._id,
          //     quantity: 2,
          //     quantityMeasure: "tablespoon",
          //   },
          //   {
          //     id: igList.find(x => x.name.toLowerCase() == "lemon")._id,
          //     quantity: 0.5,
          //     quantityMeasure: "qty",
          //   },
          // ],
          instructions:
            "Easy rice-like side dish that's much lower GI and ready in just 10 minutes. Trim the cauliflower florets, cutting away as much stem as possible. In 3 batches, break up the florets into a food processor and pulse until the mixture resembles couscous.Heat the oil in a large skillet over medium-high heat. At the first wisp of smoke from the oil, add the onions, and stir to coat. Continue cooking, stirring frequently, until the onions are golden brown at the edges and have softened, about 8 minutes. Add the cauliflower, and stir to combine. Add 1 teaspoon salt, and continue to cook, stirring frequently, until the cauliflower has softened, 3 to 5 minutes. Remove from the heat. Spoon the cauliflower into a large serving bowl, garnish with the parsley, sprinkle with the lemon juice and season to taste with salt. Serve warm.",
          reviews: [reviewObj],
          overallRating: 4,
          servings: 1,
        },
        {
          name: "Cauliflower Mac and Cheese",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: "50",
          mealType: "Snack",
          cuisine: "American",
          ingredients: [
            {
              id: igList.find(x => x.name.toLowerCase() == "butter")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              id: igList.find(x => x.name.toLowerCase() == "cauliflower")._id,
              quantity: 3,
              quantityMeasure: "cups",
            },
            {
              id: igList.find(x => x.name.toLowerCase() == "milk")._id,
              quantity: 3,
              quantityMeasure: "cup",
            },
            {
              id: igList.find(x => x.name.toLowerCase() == "mustard")._id,
              quantity: 0.5,
              quantityMeasure: "teaspoon",
            },
            {
              id: igList.find(x => x.name.toLowerCase() == "parmesan")._id,
              quantity: 0.25,
              quantityMeasure: "cup",
            },
          ],
          instructions:
            "Bring a large pot of salted water to a boil. Preheat the oven to 375 degrees F. Grease a baking dish with butter. Cook the cauliflower in the boiling water until just crisp-tender, about 10 minutes. Drain well. In a large saucepan, heat the milk and butter over medium heat. Whisk in the dry mustard and add some hot sauce, salt and pepper. Just before the milk comes to a boil, turn off the heat and stir in the pepper jack and goat cheese. When melted and smooth, stir in the cauliflower. Spread the mixture into the prepared baking dish and sprinkle over the Parmesan. Bake until the top is golden brown and the mixture is bubbling, about 30 minutes. Let rest for a few minutes before serving.",
          reviews: [],
          overallRating: 4.3,
          servings: 4,
        },
        {
          name: "Baked Artichoke",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: "90",
          mealType: "Snack",
          cuisine: "American",
          ingredients: [
            {
              id: igList.find(x => x.name.toLowerCase() == "artichoke")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              id: igList.find(x => x.name.toLowerCase() == "lemon")._id,
              quantity: 0.5,
              quantityMeasure: "qty",
            },
            {
              id: igList.find(x => x.name.toLowerCase() == "olive oil")._id,
              quantity: 2,
              quantityMeasure: "tablespoon",
            },
            {
              id: igList.find(x => x.name.toLowerCase() == "garlic")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              id: igList.find(x => x.name.toLowerCase() == "parsley")._id,
              quantity: 2,
              quantityMeasure: "tablespoon",
            },
            {
              id: igList.find(x => x.name.toLowerCase() == "parmesan")._id,
              quantity: 0.5,
              quantityMeasure: "cup",
            },
          ],
          instructions:
            "Remove the stem of the artichoke. Cut about 1 inch (2 cm) off the top of the artichoke. Take a pair of kitchen scissors and snip off the thorns on the tip of the artichoke petals. Take half a lemon and rub lemon juice over the cut portion of the artichoke to prevent it from browning. Drizzle with olive oil and season with salt and pepper. Spread open the petals and rub minced garlic all over. Add the parsley and Parmesan; make sure to get it in between the petals. Top with more pepper if desired. Wrap the artichoke in aluminum foil. Bake at 425°F (220°C) for 1 hour and 20 minutes. When done, serve with extra parsley, lemon wedge and your favorite dipping sauce.",
          reviews: [],
          overallRating: 4.3,
          servings: 4,
        },
        {
          name: "Guacamole",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: "10",
          mealType: "Snack",
          cuisine: "Mexican",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "avocado")._id,
              quantity: 3,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "lime")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "onion")._id,
              quantity: 0.5,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "cilantro")._id,
              quantity: 3,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "tomato")._id,
              quantity: 2,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "parmesan")._id,
              quantity: 0.5,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "garlic")._id,
              quantity: 1,
              quantityMeasure: "teaspoon",
            },
          ],
          instructions:
            "In a medium bowl, mash together the avocados, lime juice, and salt. Mix in onion, cilantro, tomatoes, and garlic. Stir in cayenne pepper. Refrigerate 1 hour for best flavor, or serve immediately.",
          reviews: [
            "9vd99ce2-c0d2-4f8c-b27a-6a1d4b5b5063",
            "695d97a2-c0d2-4f8c-b27a-6a1d4b5b6927",
          ],
          overallRating: 4.7,
          servings: 4,
        },
      ];
      for (let i = 0; i < recipeArr.length; i++) {
        recipeArr[i].recipeImageURL = await recipesData.getGoogleImageForRecipe(
          recipeArr[i].name
        );
        console.log(`Recipes created: ${i + 1}/${recipeArr.length}`);
      }
      await recipesCollection.insertMany(recipeArr);
      console.log("Completed Adding Recipes!");

      await recipesCollection.insertMany(recipeobj);
      const recipe = await recipesCollection.findOne({name: "Cauliflower Rice"});
      await reviewsCollection.findOneAndUpdate({_id: reviewObj._id}, {$set : {"recipeId": recipe._id}});
      const reviewObj2 = await reviewsCollection.findOne({_id: reviewObj._id});
      await recipesCollection.findOneAndUpdate(
        {
          "reviews._id": reviewObj._id
        },
        {
          $set: {
            "reviews.$": reviewObj2 // Update with new object
          }
        }
      );
      // await reviewsCollection.insertOne(testData.reviewObj);
      // await commentsCollection.insertOne(testData.commentObj);
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

main().catch(error => {
  console.log(error);
});
