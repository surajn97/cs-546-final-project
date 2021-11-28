const mongoCollections = require("../config/mongoCollections");
const reviewFunctions = require("./reviews");
const reviews = mongoCollections.reviews;
const comments = mongoCollections.comments;
const util = require("./util");
let { ObjectId } = require("mongodb");

module.exports = {
    async create(reviewId, userId, comment) {
      util.checkProperString(reviewId, "Recipe ID");
      util.checkProperString(userId, "User Id");
      util.checkProperString(comment, "Comment Text");
  
      if (!ObjectId.isValid(reviewId)) throw "Error: Not a valid ObjectId";
      // let ID = ObjectId(recipeId);
  
      const review = await reviewFunctions.get(reviewId);
      if (!review) {
        throw "Error: No review with that id";
      }
  
      const commentCollection = await comments();
      let newComment = {
        reviewId: ObjectId(reviewId),
        userId: ObjectId(userId),
        comment: comment,
        dateOfComment: new Date()
      };
  
      const insertInfo = await commentCollection.insertOne(newComment);
      if (insertInfo.insertedCount === 0) throw "Could not create a Comment";
  
      const newId = insertInfo.insertedId.toString();
  
      const commentobj = await this.get(newId);
      await reviewFunctions.addCommentToReview(reviewId, newId, commentobj);
      return commentobj;
    },
  
    async getAll(reviewId) {
      util.checkProperString(reviewId, "Review ID");
      if (!ObjectId.isValid(reviewId)) throw "Error: Not a valid ObjectId";
      // let ID = ObjectId(recipeId);
  
      const review = await reviewFunctions.get(reviewId);
      if (!review) {
        throw "Error: No review with that id";
      }
      const comments = review.comments;
      return comments;
    },
  
    async get(id) {
      util.checkProperString(id, "Comment ID");
      if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
      let ID = ObjectId(id);
      const commentCollection = await comments();
  
      const comment = await commentCollection.findOne({ _id: ID });
      if (comment === null) {
        throw "Error: No comment with that id";
      }
      comment._id = comment._id.toString();
      return comment;
    },
  
    async remove(id) {
      util.checkProperString(id, "Comment ID");
      if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
      let ID = ObjectId(id);
  
      const comment = await get(id);
      if (!comment) {
        throw "Error: No comment with that id";
      }
  
      const commentCollection = await comments(); 
      const reviewCollection = await reviews();
      const review = await reviewCollection.findOne({
        comments: { $elemMatch: { _id: ID } },
      });
      const reviewID = review._id.toString();
      const deletionInfo = await commentCollection.deleteOne({ _id: ID });
  
      if (deletionInfo.deletedCount === 0) {
        throw `Error: Could not delete comment with id of ${ID}`;
      }
  
      await reviewFunctions.removeCommentFromReview(reviewID, ID);
  
      return { commentId: id, deleted: true };
    },
  };