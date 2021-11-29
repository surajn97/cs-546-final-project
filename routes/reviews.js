const express = require("express");
const { recipes } = require("../data");
const router = express.Router();
const data = require("../data");
const reviewData = data.reviews;

router.get("/review/:id", async (req, res) => {
  try {
    helper.checkAndGetID(req.params.id);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  // if (!req.params.id) {
  //   res.status(400).json({
  //     error: "You must Supply an recipe id to get review of that recipe",
  //   });
  //   return;
  // }
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
    res.status(400).json({ error: "You must provide review id" });
    // res.status(400);
    return;
  }
  if (!ReviewData.title) {
    res.status(400).json({ error: "You must provide review title" });
    // res.status(400);
    return;
  }
  if (!ReviewData.reviewer) {
    res.status(400).json({ error: "You must provide reviewer" });
    // res.status(400);
    return;
  }
  if (!ReviewData.rating) {
    res.status(400).json({ error: "You must provide rating" });
    return;
  }
  if (!ReviewData.dateOfReview) {
    res.status(400).json({ error: "You must provide date Of Review" });
    return;
  }
  if (!ReviewData.review) {
    res.status(400).json({ error: "You must provide review" });
    return;
  }

  try {
    const { title, reviewer, rating, dateOfReview, review } = ReviewData;
    const newReview = await reviewData.create(
      req.params.id,
      title,
      reviewer,
      rating,
      dateOfReview,
      review
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
