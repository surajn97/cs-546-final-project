const express = require("express");
const router = express.Router();
const data = require("../data");
const reviewsData = data.reviews;
const commentsData = data.comments;
const helper = require("../data/helper");
const xss = require("xss");

router.get("/comment/:id", async (req, res) => {
    try {
        helper.checkAndGetID(req.params.id);
    } catch (e) {
        res.status(400).json({
            error: e
        });
        return;
    }
    if (!req.params.id) {
        res.status(400).json({
            error: "You must Supply a comment id to get comment data",
        });
        return;
    }
    try {
        const id = xss(req.params.id);
        const comment = await commentsData.get(id);
        res.json(comment);
    } catch (e) {
        res.status(404).json({
            error: e
        });
        return;
    }
});

router.get("/:id", async (req, res) => {
    try {
        helper.checkAndGetID(req.params.id);
    } catch (e) {
        res.status(400).json({
            error: e
        });
        return;
    }
    if (!req.params.id) {
        res.status(400).json({
            error: "You must Supply a review id to get comments of that review",
        });
        return;
    }
    try {
        const id = xss(req.params.id);
        const commentList = await commentsData.getAll(id);
        res.json(commentList);
        // res.status(200);
    } catch (e) {
        res.status(500).json({
            error: e
        });
        return;
        // res.status(500);
    }
});

router.post("/:id", async (req, res) => {
    if (!req.session.user) {
        res.status(401).json({
          error: "Unauthorized!"
        });
      }
    try {
        helper.checkAndGetID(req.params.id);
    } catch (e) {
        res.status(400).json({
            error: e
        });
        return;
    }
    const commentBody = req.body;
    if (!commentBody) {
        res.status(400).json({
            error: "You must Supply data to post"
        });
        return;
        // res.status(400);
    }

    if (!req.params.id) {
        res.status(400).json({
            error: "You must provide review id"
        });
        // res.status(400);
        return;
    }
    if (!commentBody.comment) {
        res.status(400).json({
            error: "You must provide a comment"
        });
        // res.status(400);
        return;
    }
    // if (!commentBody.name) {
    //     res.status(400).json({
    //         error: "You must provide commenter name"
    //     });
    //     // res.status(400);
    //     return;
    // }

    try {
        const id = xss(req.params.id);
        const comment = xss(commentBody.comment);
        const newComment = await commentsData.create(
            id,
            // add logged in user id
            req.session.user._id.toString(),
            comment,
        );
        // res.json(newComment);
        const review = await reviewsData.get(req.params.id);
        res.redirect("/recipes/" + review.recipeId.toString());
        // res.status(200);
        return;
    } catch (e) {
        res.status(500).json({
            error: e
        });
        // res.status(500);
        return;
    }
});

router.delete("/:id", async (req, res) => {
    try {
        helper.checkAndGetID(req.params.id);
    } catch (e) {
        res.status(400).json({
            error: e
        });
        return;
    }
    // if (!req.params.id) {
    //   res.status(400).json({ error: "You must Supply and ID to delete" });
    //   // res.status(400);
    //   return;
    // }
    try {
        await commentsData.get(req.params.id);
    } catch (e) {
        res.status(404).json({
            error: e
        });
        // res.status(404);
        return;
    }
    try {
        const id = xss(req.params.id);
        let commentResp = await commentsData.remove(id);
        res.json(commentResp);
        // res.status(200);
        return;
    } catch (e) {
        res.status(500).json({
            error: e
        });
        return;
        // res.status(500);
        // recipes;
    }
});

module.exports = router;
