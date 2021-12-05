const express = require('express');
const router = express.Router();
const reviews = require('../data/reviews');
const recipes = require('../data/recipes');


router.get('/', async (req, res) => {
  if (req.session.user) {
    const userData = req.session.user;
    // console.log("userData")
    // console.log(userData)
    // console.log("userData")


    // Get list of myFavoriteRecipe
    let myFavRecipe = [];
    for (let RecipeId of userData.myFavoriteRecipe) {
      let FRec = await recipes.get(RecipeId); //add getrecipes id function
      myFavRecipe.push({
        id: RecipeId,
        name: FRec.name
      });
    }
    let hasFRecipe = false;
    if (myFavRecipe.length > 0) {
      hasFRecipe = true;
    }
    // Get list of myRecipes
    let myReclist = [];
    for (let RecipeId of userData.myRecipes) {
      let mRec = await recipes.get(RecipeId); //add getrecipes id function, need check
      myReclist.push({
        id: RecipeId,
        name: mRec.name
      });
    }
    let hasMRecipe = false;
    if (myReclist.length > 0) {
      hasMRecipe = true;
    }
    // Get list of myReviews
    let myReviewsList = [];
    for (let ReviewsId of userData.myReviews) {
      let mRev = await reviews.get(ReviewsId); //add getrecipes id function  ,need check
      let recipename = await recipes.get(mRev.RecipeId);
      myReviewsList.push({
        id: reviewId,
        recipename: recipename,
        rating: mRev.rating,
        reviewTest: mRev.reviewTest
      });
    }
    let hasReview = false;
    if (myReviewsList.length > 0) {
      hasReview = true;
    }



    res.render('users/private', {
      username: req.session.user.username,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      age: userData.age,
      myFavRecipe: myFavRecipe,
      myRecipes: myReclist,
      myReviews: myReviewsList,
      hasFRecipe: hasFRecipe,
      hasMRecipe: hasMRecipe,
      hasReview: hasReview,
    });
  } else {
    res.redirect('/login');

  }


});

module.exports = router;
