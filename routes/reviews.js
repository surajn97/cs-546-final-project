const express = require("express");
const { recipes } = require("../data");
const router = express.Router();
const data = require("../data");
const reviewData = data.reviews;
const helper = require("../data/helper");
const xss = require("xss");

router.get("/review/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({
      error: e,
    });
    return;
  }
  if (!req.params.id) {
    res.status(400).json({
      error: "You must supply a review id to get reviews data",
    });
    return;
  }
  try {
    const id = xss(req.params.id);
    const review = await reviewData.get(id);
    res.json(review);
  } catch (e) {
    res.status(404).json({
      error: e,
    });
    return;
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({
      error: e,
    });
    return;
  }
  if (!req.params.id) {
    res.status(400).json({
      error: "You must supply a review id to get reviews data",
    });
    return;
  }
  try {
    const id = xss(req.params.id);
    const review = await reviewData.getAllByUser(id);
    res.json(review);
  } catch (e) {
    res.status(404).json({
      error: e,
    });
    return;
  }
});

router.get("/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({
      error: e,
    });
    return;
  }
  if (!req.params.id) {
    res.status(400).json({
      error: "You must supply a recipe id to get reviews of that recipe",
    });
    return;
  }
  try {
    const id = xss(req.params.id);
    const reviewList = await reviewData.getAll(id);
    res.json(reviewList);
    // res.status(200);
  } catch (e) {
    res.status(500).json({
      error: e,
    });
    return;
    // res.status(500);
  }
});

router.post("/:id", async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({
      error: "Unauthorized!",
    });
  }
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({
      error: e,
    });
    return;
  }
  const ReviewData = req.body;
  if (!ReviewData) {
    res.status(400).json({
      error: "You must Supply data to post",
    });
    return;
    // res.status(400);
  }

  if (!req.params.id) {
    res.status(400).json({
      error: "You must provide recipe id",
    });
    // res.status(400);
    return;
  }
  if (!ReviewData.reviewText) {
    res.status(400).json({
      error: "You must provide review text",
    });
    // res.status(400);
    return;
  }
  if (!ReviewData.userId) {
    res.status(400).json({
      error: "You must provide reviewer user id",
    });
    // res.status(400);
    return;
  }
  if (!ReviewData.rating) {
    res.status(400).json({
      error: "You must provide rating",
    });
    return;
  }

  try {
    const {
      recipeId,
      userId,
      reviewText,
      rating,
      dateOfReview,
      likes,
      dislikes,
      comments,
    } = ReviewData;
    const id = xss(req.params.id);
    const ratingXss = xss(ReviewData.rating);
    const reviewTextXss = xss(ReviewData.reviewText);
    const newReview = await reviewData.create(
      id,
      ratingXss,
      reviewTextXss,
      // should be logged in user id
      req.session.user._id.toString()
    );
    res.redirect("/recipes/" + req.params.id);
    // res.status(200);
    return;
  } catch (e) {
    res.status(500).json({
      error: e,
    });
    // res.status(500);
    return;
  }
});

router.post("/like/:id", async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({
      status: "fail",
      error: "Please login first to like the review",
    });
  }
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({
      status: "fail",
      error: e,
    });
    return;
  }
  if (!req.params.id) {
    res.status(400).json({
      status: "fail",
      error: "You must provide a review id",
    });
    // res.status(400);
    return;
  }

  try {
    const id = xss(req.params.id);
    const review = await reviewData.addLikeToReview(
      id,
      req.session.user._id.toString()
    );
    res.json({
      status: "success",
      likes: review.likes.length - review.dislikes.length,
      message: "successfully liked the review",
    });
  } catch (e) {
    res.status(404).json({
      status: "fail",
      error: e,
    });
    // res.status(404);
    return;
  }
});

router.post("/dislike/:id", async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({
      status: "fail",
      error: "Please login first to dislike the review",
    });
  }
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({
      status: "fail",
      error: e,
    });
    return;
  }
  if (!req.params.id) {
    res.status(400).json({
      status: "fail",
      error: "You must provide a review id",
    });
    // res.status(400);
    return;
  }

  try {
    const id = xss(req.params.id);
    const review = await reviewData.addDislikeToReview(
      id,
      req.session.user._id.toString()
    );
    res.json({
      status: "success",
      likes: review.likes.length - review.dislikes.length,
      message: "successfully disliked the review",
    });
  } catch (e) {
    res.status(404).json({
      status: "fail",
      error: e,
    });
    // res.status(404);
    return;
  }
});

router.delete("/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({
      error: e,
    });
    return;
  }
  // if (!req.params.id) {
  //   res.status(400).json({ error: "You must Supply and ID to delete" });
  //   // res.status(400);
  //   return;
  // }
  try {
    await reviewData.get(req.params.id);
  } catch (e) {
    res.status(404).json({
      error: e,
    });
    // res.status(404);
    return;
  }
  try {
    const id = xss(req.params.id);
    let dreviews = await reviewData.remove(id);
    res.json(dreviews);
    // res.status(200);
    return;
  } catch (e) {
    res.status(500).json({
      error: e,
    });
    return;
    // res.status(500);
    // recipes;
  }
});

module.exports = router;
