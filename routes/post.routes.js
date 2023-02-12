const { Router } = require("express");
const {
  addPost,
  getPost,
  patchPost,
  patchLikeDislike,
  deletePost,
  patchFavourite,
} = require("../controllers/post.controllers");
const { authorization } = require("../middleware/authorization");
const postRouter = Router();
const multer = require("multer");
const upload = multer({ dest: 'uploads/' })

postRouter.post("/publish", upload.single("postImage"), async (req, res) => {
  // console.log("req", req);
  // console.log("File", req.file);
  // console.log("Body", req.body.postDescription);
});

postRouter.post("/add-post", authorization, async (req, res) => {
  const postData = req.body;
  const userId = req.user._id;
  try {
    const post = await addPost(userId, postData);
    return res.send({
      data: post,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
});

postRouter.get("/get-post", async (req, res) => {
  try {
    const post = await getPost();
    return res.send({
      data: post,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
});

postRouter.patch("/patch-post", authorization, async (req, res) => {
  const userId = req.user._id;
  const patchData = req.body;
  const postId = patchData.postId;

  try {
    const post = await patchPost(userId, postId, patchData);
    return res.send({
      data: post,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
});
postRouter.patch("/patch-likeDislike", authorization, async (req, res) => {
  const userId = req.user._id;
  const patchData = req.body;
  const postId = patchData.postId;

  try {
    const post = await patchLikeDislike(userId, postId, patchData);
    return res.send({
      data: post,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
});
postRouter.patch("/patch-favourite", authorization, async (req, res) => {
  const userId = req.user._id;
  const patchData = req.body;
  const postId = patchData.postId;

  try {
    const post = await patchFavourite(userId, postId, patchData);
    return res.send({
      data: post,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
});

postRouter.delete("/delete-post", authorization, async (req, res) => {
  const userId = req.user._id;
  const postId = req.body.postId;

  try {
    const post = await deletePost(userId, postId);
    return res.send({
      data: post,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
});

module.exports = {
  postRouter,
};
