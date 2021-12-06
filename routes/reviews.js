const express = require("express");
const { recipes } = require("../data");
const router = express.Router();
const data = require("../data");
const reviewData = data.reviews;
const helper = require("../data/helper");

router.get("/review/:id", async (req, res) => {
  // try {
  //   helper.checkAndGetID(req.params.id);
  // } catch (e) {
  //   res.status(400).json({ error: e });
  //   return;
  // }
  if (!req.params.id) {
    res.status(400).json({
      error: "You must Supply an recipe id to get review of that recipe",
    });
    return;
  }
  try {
    const review = await reviewData.get(req.params.id);
    res.json(review);
  } catch (e) {
    res.status(404).json({ error: e });
    return;
  }
});

router.get("/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  try {
    const reviewList = await reviewData.getAll(req.params.id);
    res.json(reviewList);
    // res.status(200);
  } catch (e) {
    res.status(500).json({ error: e });
    return;
    // res.status(500);
  }
});

router.post("/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  const ReviewData = req.body;
  if (!ReviewData) {
    res.status(400).json({ error: "You must Supply data to post" });
    return;
    // res.status(400);
  }

  if (!req.params.id) {
    res.status(400).json({ error: "You must provide recipe id" });
    // res.status(400);
    return;
  }
  if (!ReviewData.reviewText) {
    res.status(400).json({ error: "You must provide review text" });
    // res.status(400);
    return;
  }
  if (!ReviewData.userId) {
    res.status(400).json({ error: "You must provide reviewer user id" });
    // res.status(400);
    return;
  }
  if (!ReviewData.rating) {
    res.status(400).json({ error: "You must provide rating" });
    return;
  }

  try {
    const { recipeId, userId, reviewText, rating, dateOfReview, likes, dislikes, comments } = ReviewData;
    const newReview = await reviewData.create(
      req.params.id,
      ReviewData.rating,
      ReviewData.reviewText,
      ReviewData.userId
    );
    res.json(newReview);
    // res.status(200);
    return;
  } catch (e) {
    res.status(500).json({ error: e });
    // res.status(500);
    return;
  }
});

router.delete("/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({ error: e });
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
    res.status(404).json({ error: e });
    // res.status(404);
    return;
  }
  try {
    let dreviews = await reviewData.remove(req.params.id);
    res.json(dreviews);
    // res.status(200);
    return;
  } catch (e) {
    res.status(500).json({ error: e });
    return;
    // res.status(500);
    // recipes;
  }
});

module.exports = router;
