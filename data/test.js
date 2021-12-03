const userobj = {
  // _id: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@gmail.com",
  username: "John_D",
  age: 32,
  passwordHash: "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
  myFavoriteRecipe: [
    "c0d27a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "968e97a2-c0d2-4f8c-b27a-6a1d4b5b9476",
  ],
  myRecipes: ["c0d27a2-c0d2-4f8c-b27a-6a1d4b5b6310"],
  myReviews: [
    "9vd99ce2-c0d2-4f8c-b27a-6a1d4b5b5063",
    "695d97a2-c0d2-4f8c-b27a-6a1d4b5b6927",
  ]
};

const recipeobj = {
  // _id: "c0d27a2-c0d2-4f8c-b27a-6a1d4b5b6310",
  name: "Cauliflower rice",
  postedBy: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
  cookingTime: "10",
  mealType: "Lunch",
  cuisine: "French Cuisine",
  ingredients: [
    {
      _id: "871982708es312sesde3414",
      quantity: 3,
      quantityMeasure: "teaspoons",
    },
    { _id: "871982708es312sesde3415", quantity: 4, quantityMeasure: "grams" },
  ],
  instructions:
    "Easy rice-like side dish that's much lower GI and ready in just 10 minutes",
  reviews: [
    "9vd99ce2-c0d2-4f8c-b27a-6a1d4b5b5063",
    "695d97a2-c0d2-4f8c-b27a-6a1d4b5b6927",
  ],
  overallRating: 4,
  servings: 8
};

const reviewObj = {
  // _id: "9vd99ce2-c0d2-4f8c-b27a-6a1d4b5b5063",
  recipeId: "c0d27a2-c0d2-4f8c-b27a-6a1d4b5b6310",
  rating: 4,
  reviewText: "First time trying this.",
  likes: ["c0d27a2-c0d2-4f8c-b27a-6ad9v9wb6310"],
  dislikes: ["c0d27a2-c0d2-4f8c-b27a-6ad9v9wb6322"],
  comments: ["c0o27m2-m0e2-4n8t-b27a-6ad9v9wb9471"],
  userID: "c0d27a2-c0d2-4f8c-b27a-6ad9v9wb6310"
};

const commentObj = {
  // _id: "c0o27m2-m0e2-4n8t-b27a-6ad9v9wb9471",
  name: "John_D",
  comment: "Nice try."
};

const ingredientObjs = [
  {name: "Sugar"},
  {name: "Onion"},
  {name: "Garlic"},
  {name: "Olive Oil"},
  {name: "Tomato"},
  {name: "Salt"},
  {name: "Milk"},
  {name: "Potato"},
  {name: "Chilli"},
  {name: "Cheese"},
  {name: "Turnip"},
  {name: "Cabbage"},
  {name: "Zucchini"},
  {name: "Bell Pepper"},
  {name: "Red Pepper"},
];

module.exports = {
  userobj: userobj,
  recipeobj: recipeobj,
  reviewObj: reviewObj,
  commentObj: commentObj,
  ingredientObjs: ingredientObjs
}
