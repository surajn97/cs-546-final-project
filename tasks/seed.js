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
const cuisineList = ["American", "French", "Indian", "Chinese", "Greek"];
const mealTypeList = ["lunch", "breakfast", "dinner", "brunch", "snack"];
const qtyMeasures = ["qty", "cup", "teaspoon", "tablespoon"];
// const reviews = data.reviews;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function getRecipeAttributes(userId, ingredientsList) {
  const ingredients = [];
  const igCount = getRandomInt(3, 7);
  for (let i = 0; i < igCount; i++) {
    ingredients.push({
      _id: ingredientsList[getRandomInt(0, ingredientsList.length - 1)]._id,
      quantity: getRandomInt(1, 3),
      quantityMeasure: qtyMeasures[getRandomInt(0, qtyMeasures.length - 1)],
    });
  }
  return {
    name: "Baked Artichoke",
    postedBy: userId.toString(),
    cookingTime: getRandomInt(15, 90),
    mealType: mealTypeList[getRandomInt(0, mealTypeList.length - 1)],
    cuisine: cuisineList[getRandomInt(0, cuisineList.length - 1)],
    ingredients: ingredients,
    instructions:
      "Remove the stem of the artichoke. Cut about 1 inch (2 cm) off the top of the artichoke. Take a pair of kitchen scissors and snip off the thorns on the tip of the artichoke petals. Take half a lemon and rub lemon juice over the cut portion of the artichoke to prevent it from browning. Drizzle with olive oil and season with salt and pepper. Spread open the petals and rub minced garlic all over. Add the parsley and Parmesan; make sure to get it in between the petals. Top with more pepper if desired. Wrap the artichoke in aluminum foil. Bake at 425°F (220°C) for 1 hour and 20 minutes. When done, serve with extra parsley, lemon wedge and your favorite dipping sauce.",
    reviews: [],
    overallRating: 0,
    servings: getRandomInt(2, 5),
  };
}

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
      const userObj = await usersCollection.findOne({
        _id: userInfo.insertedId,
      });
      testData.commentObj["userId"] = userObj._id;
      const commentInfo = await commentsCollection.insertOne(
        testData.commentObj
      );
      const commentObj = await commentsCollection.findOne({
        _id: commentInfo.insertedId,
      });

      testData.reviewObj["comments"] = [commentObj];
      testData.reviewObj["likes"] = [userObj._id.toString()];
      testData.reviewObj["dislikes"] = [userObj._id.toString()];
      userObj._id = userObj._id.toString();
      testData.reviewObj["user"] = userObj;
      const reviewInfo = await reviewsCollection.insertOne(testData.reviewObj);
      const reviewObj = await reviewsCollection.findOne({
        _id: reviewInfo.insertedId,
      });

      let igList = [];
      console.log("Creating Ingredients:");
      for (const ig in testData.ingredientObjs) {
        let keys = Object.keys(testData.ingredientObjs[ig]);
        keys.sort();
        for (const ingredient of keys) {
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
      console.log("Completed Adding Ingredients!");
      console.log(
        "Creating Recipes... This might take a while as it is fetching images from google"
      );
      const recipeArr = [
        {
          name: "Cauliflower Rice",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 25,
          mealType: "lunch",
          cuisine: "French",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "cauliflower")
                ._id,
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
          cookingTime: 50,
          mealType: "snack",
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
              quantityMeasure: "cup",
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
              quantityMeasure: "cup",
            },
          ],
          instructions:
            "Bring a large pot of salted water to a boil. Preheat the oven to 375 degrees F. Grease a baking dish with butter. Cook the cauliflower in the boiling water until just crisp-tender, about 10 minutes. Drain well. In a large saucepan, heat the milk and butter over medium heat. Whisk in the dry mustard and add some hot sauce, salt and pepper. Just before the milk comes to a boil, turn off the heat and stir in the pepper jack and goat cheese. When melted and smooth, stir in the cauliflower. Spread the mixture into the prepared baking dish and sprinkle over the Parmesan. Bake until the top is golden brown and the mixture is bubbling, about 30 minutes. Let rest for a few minutes before serving.",
          reviews: [],
          overallRating: 0,
          servings: 4,
        },
        {
          name: "Baked Artichoke",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 90,
          mealType: "snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "artichoke")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "lemon")._id,
              quantity: 0.5,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "olive oil")._id,
              quantity: 2,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "garlic")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "parsley")._id,
              quantity: 2,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "parmesan")._id,
              quantity: 0.5,
              quantityMeasure: "cup",
            },
          ],
          instructions:
            "Remove the stem of the artichoke. Cut about 1 inch (2 cm) off the top of the artichoke. Take a pair of kitchen scissors and snip off the thorns on the tip of the artichoke petals. Take half a lemon and rub lemon juice over the cut portion of the artichoke to prevent it from browning. Drizzle with olive oil and season with salt and pepper. Spread open the petals and rub minced garlic all over. Add the parsley and Parmesan; make sure to get it in between the petals. Top with more pepper if desired. Wrap the artichoke in aluminum foil. Bake at 425°F (220°C) for 1 hour and 20 minutes. When done, serve with extra parsley, lemon wedge and your favorite dipping sauce.",
          reviews: [],
          overallRating: 0,
          servings: 4,
        },
        {
          name: "Guacamole",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 10,
          mealType: "snack",
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
          ],
          instructions:
            "In a medium bowl, mash together the avocados, lime juice, and salt. Mix in onion, cilantro, tomatoes, and garlic. Stir in cayenne pepper. Refrigerate 1 hour for best flavor, or serve immediately.",
          reviews: [],
          overallRating: 4.7,
          servings: 4,
        },
        {
          name: "Sweet potato chilli",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 50,
          mealType: "snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "onion")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "garlic")._id,
              quantity: 2,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "olive oil")._id,
              quantity: 2,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "chilli powder")
                ._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "cumin")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "sweet potato")
                ._id,
              quantity: 750,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "quinoa")._id,
              quantity: 100,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "tomato")._id,
              quantity: 400,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "vegetable stock")
                ._id,
              quantity: 600,
              quantityMeasure: "ml",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "black beans")
                ._id,
              quantity: 400,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "coriander")._id,
              quantity: 0.5,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "yogurt")._id,
              quantity: 0.5,
              quantityMeasure: "cup",
            },
          ],
          instructions:
            "Cook the onion and garlic in 1 tbsp olive oil until soft. Add the chilli powder and cumin, cook for a minute then add the sweet potato, quinoa, tomatoes and stock. Simmer for 10 minutes then add the beans and simmer for another 20-30 minutes until the sweet potato and quinoa are tender and the sauce has thickened. Scatter over the coriander and serve in bowls with a dollop of soured cream or yogurt if you like.",
          reviews: [],
          overallRating: 4.4,
          servings: 4,
        },
        {
          name: "Vegetable dumplings (jiaozi)",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 150,
          mealType: "snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "onion")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "garlic")._id,
              quantity: 3,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "vegetable oil")
                ._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "carrot")._id,
              quantity: 140,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "mooli")._id,
              quantity: 75,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "celery")._id,
              quantity: 30,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "sweet corn")._id,
              quantity: 30,
              quantityMeasure: "g",
            },
            {
              _id: igList.find(
                (x) => x.name.toLowerCase() == "chinese black fungus"
              )._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "noodles")._id,
              quantity: 25,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "chestnuts")._id,
              quantity: 3,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "bell pepper")
                ._id,
              quantity: 0.5,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "sesame oil")._id,
              quantity: 0.5,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "cornflour")._id,
              quantity: 0.5,
              quantityMeasure: "tablespoon",
            },
          ],
          instructions:
            "To make the dough, put the flour in a big bowl. Add ½ tsp of salt and the oil. Gradually pour in 175-200ml of cold water, mixing with chopsticks or a spatula to form a dough. Cover and leave to rest for 30 minutes. While the dough is resting, prepare the filling. Heat the oil in a wok or frying pan and fry the garlic for 1 minute until just turning golden. Add the vegetables, fungus, noodles, chestnuts, pepper, sesame oil and 2 tsp of salt, and stir-fry for 5 minutes until softened. Add the cornflour with 1 tbsp water and mix well. Leave to cool. Knead the dough in the bowl until you have a smooth ball. Roll the dough on a floured worksurface into a long cylinder, 3cm in diameter. Divide into 20-25 pieces. Roll each piece flat into a 7-8cm circle. Put a heaped teaspoon of the filling into the middle of a wrapper. Wet the sides with water, fold the wrapper over the filling into a half moon shape, pinch the sides to seal and put onto a baking tray dusted with flour. Repeat with the remaining wrappers and filling. Boil a large pan of salted water, then add half the dumplings, stirring gently, so they don’t stick together. Bring the water to the boil again, then add 120ml of cold water. Cover and return to the boil. Once boiling for the third time, strain and put the dumplings on a serving plate. Serve immediately with chilli oil, soy sauce or black vinegar, topped with the crushed garlic, spring onions and sesame seeds. Repeat with the remaining dumplings.",
          reviews: [],
          overallRating: 4.2,
          servings: 4,
        },
        {
          name: "Courgetti with pesto and balsamic tomatoes",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 15,
          mealType: "snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "pesto")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "garlic")._id,
              quantity: 2,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "olive oil")._id,
              quantity: 2,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "pine nuts")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "vinegar")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "courgette")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
          ],
          instructions:
            "Toss the tomatoes with 1 tsp oil, garlic and balsamic vinegar and some seasoning. Tip into a frying pan and cook for 5 minutes until the whole tomatoes start to burst and they are coated in the balsamic. Pour a kettle of hot water over the courgette spaghetti and blanch for 30 seconds. Drain really well, toss with the pesto and season well. Stir, coating the noodles, then add the tomatoes and toasted pine nuts to serve your courgetti.",
          reviews: [],
          overallRating: 4.0,
          servings: 1,
        },
        {
          name: "Veggie fajitas",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 30,
          mealType: "snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "oil")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "onion")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "red pepper")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "paprika")._id,
              quantity: 0.5,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "chilli powder")
                ._id,
              quantity: 0.5,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "black beans")
                ._id,
              quantity: 400,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "tortillas")._id,
              quantity: 4,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "cheddar")._id,
              quantity: 50,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "sour cream")._id,
              quantity: 4,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "avocado")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "tomato")._id,
              quantity: 2,
              quantityMeasure: "qty",
            },
          ],
          instructions:
            "Toss all the salsa ingredients together with a good pinch of salt and leave to sit while you make the fajitas.Heat 1 tbsp of oil in a large pan and cook the onion and pepper over a high heat until softened and starting to char at the edges. Turn down the heat and add the spices, tossing well. Add the beans with a splash of water and keep cooking until the beans are piping hot.Serve the beans in warm tortillas with the salsa, cheese, soured cream and hot sauce, if you like.",
          reviews: [],
          overallRating: 4.2,
          servings: 2,
        },
        {
          name: "Spicy tomato soup",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 25,
          mealType: "snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "garlic")._id,
              quantity: 3,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "ginger")._id,
              quantity: 0.5,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "vegetable stock")
                ._id,
              quantity: 600,
              quantityMeasure: "ml",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "bell pepper")
                ._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "yogurt")._id,
              quantity: 4,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "rice")._id,
              quantity: 5,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "chipotle paste")
                ._id,
              quantity: 2,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "green chilli")
                ._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "tomato pure")
                ._id,
              quantity: 2,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "tomato")._id,
              quantity: 400,
              quantityMeasure: "g",
            },
          ],
          instructions:
            "Put the tomatoes, tomato purée, garlic and ginger in a blender or food processor with the stock and whizz until smooth. Pour into a large pan and add the chipotle, ¾ of the coriander, green pepper, most of the chilli and seasoning. Bring to a simmer and cook on a medium heat for 10 minutes, then add the rice and cook for another 10-15 minutes or until the rice is tender. Add a little water or stock if the soup is too thick. Serve in bowls with a dollop of yogurt, the rest of the coriander and chilli, and a generous grinding of black pepper.",
          reviews: [],
          overallRating: 4.5,
          servings: 4,
        },
        {
          name: "Spiced grains with peas, spinach and jammy eggs",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 30,
          mealType: "snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "eggs")._id,
              quantity: 3,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "butter")._id,
              quantity: 25,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "onion")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find(
                (x) => x.name.toLowerCase() == "red chilli powder"
              )._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "cumin")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find(
                (x) => x.name.toLowerCase() == "ground coriander"
              )._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "turmeric")._id,
              quantity: 0.5,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "grain")._id,
              quantity: 250,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "peas")._id,
              quantity: 200,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "baby spinach")
                ._id,
              quantity: 100,
              quantityMeasure: "g",
            },
          ],
          instructions:
            "Cook the eggs in simmering water for 7 minutes. Drain and rinse under cold water. Heat the butter in a non-stick frying pan. Cook the onion and chilli for 8-10 minutes or until softened. Stir in the spices and cook for a minute then stir in the grains with a splash of water and toss together. Add the peas and spinach and cook until the spinach has wilted and everything is piping hot. Shell the eggs and halve. Spoon the freekeh into bowls and top with the eggs and a drizzle of sriracha, if you like.",
          reviews: [],
          overallRating: 4.0,
          servings: 3,
        },
        {
          name: "Cauliflower Pizza Bites",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 50,
          mealType: "snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "cauliflower")
                ._id,
              quantity: 0.5,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "garlic powder")
                ._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "coconut oil")
                ._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "hot sauce")._id,
              quantity: 2,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "flaxseed")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "tofu")._id,
              quantity: 0.5,
              quantityMeasure: "cup",
            },
          ],
          instructions:
            "Use a food processor or grate the cauliflower to rice-sized chunks. Pre-heat oven (or toaster oven) to 450F. Spray muffin tin with cooking oil. mix flax with 3tbsp water and set aside to thicken. Stir-fry the cauliflower 6-8 minutes until translucent. Blend or whisk the flax, tofu, hot sauce, garlic powder and any herbs such as oregano or parsley. Combine cauliflower with mixture and press into muffin tin molds. Bake 30 minutes , then let cool for 10 minutes before removing from tin",
          reviews: [],
          overallRating: 0,
          servings: 2,
        },
        {
          name: "Vegetable Fried Rice",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 35,
          mealType: "snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "brown rice")._id,
              quantity: 1,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "carrot")._id,
              quantity: 1,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "olive oil")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "onion")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "peas")._id,
              quantity: 0.5,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "egg")._id,
              quantity: 2,
              quantityMeasure: "qty",
            },
          ],
          instructions:
            "Cook brown rice according to package directions and chop the carrots. In a frying pan, add a little bit of olive oil and then onions, peas, and carrots. After 5 minutes of cooking, add your eggs and scramble until eggs are set. Mix into the rice and enjoy!",
          reviews: [],
          overallRating: 4.0,
          servings: 1,
        },
        {
          name: "Falafel",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 25,
          mealType: "snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "chickpeas")._id,
              quantity: 1,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "baking soda")
                ._id,
              quantity: 0.5,
              quantityMeasure: "teaspoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "cilantro")._id,
              quantity: 1,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "mint leaves")
                ._id,
              quantity: 0.5,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "garlic")._id,
              quantity: 5,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find(
                (x) => x.name.toLowerCase() == "ground coriander"
              )._id,
              quantity: 1,
              quantityMeasure: "teaspoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "chilli powder")
                ._id,
              quantity: 1,
              quantityMeasure: "teaspoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "salt")._id,
              quantity: 1,
              quantityMeasure: "teaspoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "pepper")._id,
              quantity: 0.5,
              quantityMeasure: "teaspoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "sesame seeds")
                ._id,
              quantity: 1,
              quantityMeasure: "teaspoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "baking powder")
                ._id,
              quantity: 1,
              quantityMeasure: "teaspoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "oil")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
          ],
          instructions:
            "In a large bowl, cover chickpeas with water. Stir in 1/2 teaspoon baking soda. Cover and let stand overnight. Drain chickpeas; rinse and pat dry. In a food processor, pulse cilantro and mint until finely chopped. Add chickpeas, garlic, salt, pepper if desired, coriander and chili powder. Pulse until blended and texture of coarse meal. Transfer to a large bowl. Cover and refrigerate at least 1 hour. Stir in sesame seeds and baking powder. Shape into sixteen 2-in. balls. In an electric skillet or a deep-fat fryer, heat oil to 375°. Fry chickpea balls, a few at a time, until golden brown, about 2 minutes, turning occasionally. Drain on paper towels.",
          reviews: [],
          overallRating: 5.0,
          servings: 1,
        },
        {
          name: "Rose Water Rice Pudding",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 55,
          mealType: "snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "water")._id,
              quantity: 4,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "grain rice")._id,
              quantity: 2,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find(
                (x) => x.name.toLowerCase() == "half and half cream"
              )._id,
              quantity: 4,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "sugar")._id,
              quantity: 1.5,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "rose water")._id,
              quantity: 2,
              quantityMeasure: "teaspoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "pomegranate")
                ._id,
              quantity: 2,
              quantityMeasure: "tablespoon",
            },
          ],
          instructions:
            "In a heavy saucepan, combine water and rice; bring to a boil over medium heat. Reduce heat; cover and simmer until water is absorbed, about 15 minutes. Add cream and sugar; bring to a boil. Reduce heat; simmer, uncovered, until slightly thickened, 30-40 minutes. Stir in rose water. Refrigerate until chilled, at least 2 hours. Stir in additional cream to reach desired consistency. If desired, top with pomegranate seeds and pistachios.",
          reviews: [],
          overallRating: 5.0,
          servings: 14,
        },
        {
          name: "Buddha bowls with shredded sprouts and beets",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 20,
          mealType: "snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "lemon")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "mustard")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "quinoa")._id,
              quantity: 400,
              quantityMeasure: "g",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "mint leaves")
                ._id,
              quantity: 0.5,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "coriander")._id,
              quantity: 0.5,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "carrot")._id,
              quantity: 2,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "chickpeas")._id,
              quantity: 400,
              quantityMeasure: "g",
            },
            {
              _id: igList.find(
                (x) => x.name.toLowerCase() == "brussels sprouts"
              )._id,
              quantity: 12,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "beetroot")._id,
              quantity: 12,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "red pepper")._id,
              quantity: 2,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "pumpkin seeds")
                ._id,
              quantity: 2,
              quantityMeasure: "tablespoon",
            },
          ],
          instructions:
            "Whisk 1 tbsp oil, lemon zest and juice, mustard and season well. Toss half the dressing with the cooked quinoa and the chopped herbs. Divide between four bowls. Top with the carrot, beans, sprouts, beetroot and pepper in piles on top of the quinoa. Spoon over the remaining dressing and scatter with the seeds to serve..",
          reviews: [],
          overallRating: 5.0,
          servings: 4,
        },
        {
          name: "Spiced carrot and lentil soup",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 50,
          mealType: "snack",
          cuisine: "American",
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "brown rice")._id,
              quantity: 1,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "carrot")._id,
              quantity: 1,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "olive oil")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "onion")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "peas")._id,
              quantity: 0.5,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "egg")._id,
              quantity: 2,
              quantityMeasure: "qty",
            },
          ],
          instructions:
            "Heat 1 tbsp of oil in a large pan and soften the onions and carrots for 10 minutes. Add the curry powder and fry for 2 minutes before adding the lentils and stock. Bring to the boil and simmer for 20 minutes until the carrots are tender and lentils soft. Season with pepper and a little salt if it needs it. Take off the heat and blend until smooth using a stick blender (or blend in a food processor then pour back into the pan to reheat). Heat the rest of the oil in a small frying pan then sizzle the cumin seeds until golden and fragrant. Top each bowl of soup with a spoonful of yogurt, the cumin seeds and a sprinkle of coriander leaves.",
          reviews: [],
          overallRating: 4.4,
          servings: 4,
        },
        {
          name: "Pizza",
          postedBy: userInfo.insertedId.toString(),
          cookingTime: 35,
          ingredients: [
            {
              _id: igList.find((x) => x.name.toLowerCase() == "brown rice")._id,
              quantity: 1,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "carrot")._id,
              quantity: 1,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "olive oil")._id,
              quantity: 1,
              quantityMeasure: "tablespoon",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "onion")._id,
              quantity: 1,
              quantityMeasure: "qty",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "peas")._id,
              quantity: 0.5,
              quantityMeasure: "cup",
            },
            {
              _id: igList.find((x) => x.name.toLowerCase() == "egg")._id,
              quantity: 2,
              quantityMeasure: "qty",
            },
          ],
          mealType: "snack",
          cuisine: "American",
          overallRating: 0,
          instructions: `“Bloom” the yeast by sprinkling the sugar and yeast in the warm water. Let sit for 10 minutes, until bubbles form on the surface.     
            'In a large bowl, combine the flour and salt. Make a well in the middle and add the olive oil and bloomed yeast mixture. Using a spoon, mix until a shaggy dough begins to form.
            'Once the flour is mostly hydrated, turn the dough out onto a clean work surface and knead for 10-15 minutes. The dough should be soft, smooth, and bouncy. 
        Form the dough into a taut round.
            'Grease a clean, large bowl with olive oil and place the dough inside, turning to coat with the oil. Cover with plastic wrap. Let rise for at least an hour, or up to 24 hours.
            'Punch down the dough and turn it out onto a lightly floured work surface. Knead for another minute or so, then cut into 4 equal portions and shape into rounds.
            'Lightly flour the dough, then cover with a kitchen towel and let rest for another 30 minutes to an hour while you prepare the sauce and any other ingredients.
            'Preheat the oven as high as your oven will allow, between 450-500˚F (230-260˚C). Place a pizza stone, heavy baking sheet (turn upside down so the surface is flat), or cast iron skillet in the oven.
            'Meanwhile, make the tomato sauce: Add the salt to the can of tomatoes and puree with an immersion blender, or transfer to a blender or food processor, and 
        puree until smooth.
            'Once the dough has rested, take a portion and start by poking the surface with your fingertips, until bubbles form and do not deflate.
            'Then, stretch and press the dough into a thin round. Make it thinner than you think it should be, as it will slightly shrink and puff up during baking.
            'Sprinkle semolina onto an upside down baking sheet and place the stretched crust onto it. Add the sauce and ingredients of your choice.
            'Slide the pizza onto the preheated pizza stone or pan. Bake for 15 minutes, or until the crust and cheese are golden brown.
            'Add any garnish of your preference.`,
          reviews: [],
          servings: 2,
        },
      ];

      const dummyRecipeNames = [
        "Pasta",
        "Salmon Marinade",
        "Crab Roll",
        "Marsala Cream Sauce",
        "Hot Chocolate",
        "Halwa",
        "Calamari on Pasta",
        "Calas",
        "Calcutta Mary",
        "Pacoca",
        "Sables",
        "Pad Thai",
        "Sabich",
        "Olive Loaf",
        "Braised Potatoes",
        "Coffee Cake",
        "Muffins",
        "Egg White Sandwich",
        "Olive Oil Braised Potatoes",
        "Olive Oil Coffee Cake",
        "Olive Oil Muffins",
        "Egg and Avocado Toast",
        "Egg and Bacon Salad",
        "Egg Tarts",
        "Kale Chips",
        "Kale Doughnuts",
        "Kale Salad",
        "Key Lime Pie",
        "Ice Cream Sandwiches",
        "Key Lime Sorbet",
        "Shrimp Ceviche",
        "Prawns with Citrus Salad",
        "Stuffed Chicken Breasts",
      ];
      for (let i = 0; i < dummyRecipeNames.length; i++) {
        const dummyRec = getRecipeAttributes(
          userInfo.insertedId.toString(),
          igList
        );
        dummyRec["name"] = dummyRecipeNames[i];
        recipeArr.push(dummyRec);
      }

      for (let i = 0; i < recipeArr.length; i++) {
        recipeArr[i].recipeImageURL = await recipesData.getGoogleImageForRecipe(
          recipeArr[i].name
        );
        console.log(`Recipes created: ${i + 1}/${recipeArr.length}`);
      }
      await recipesCollection.insertMany(recipeArr);
      console.log("Completed Adding Recipes!");

      // await recipesCollection.insertMany(recipeobj);
      const recipe = await recipesCollection.findOne({
        name: "Cauliflower Rice",
      });
      await reviewsCollection.findOneAndUpdate(
        { _id: reviewObj._id },
        { $set: { recipeId: recipe._id } }
      );
      const reviewObj2 = await reviewsCollection.findOne({
        _id: reviewObj._id,
      });
      await recipesCollection.findOneAndUpdate(
        {
          "reviews._id": reviewObj._id,
        },
        {
          $set: {
            "reviews.$": reviewObj2, // Update with new object
          },
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

main().catch((error) => {
  console.log(error);
});
