const { Router } = require("express");
const { addComment } = require("../controllers/comment.controllers");
const commentRouter = Router();
const { authorization } = require("../middleware/authorization");

commentRouter.post("/add-comment", authorization, async (req, res) => {
  const commentData = req.body;
  const postId = commentData.postId;
  const userId = req.user._id;

  try {
    let comment = await addComment(userId, postId, commentData);
    return res.send({
      data: comment,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

module.exports = {
  commentRouter,
};
