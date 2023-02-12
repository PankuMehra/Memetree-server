const mongoose = require("mongoose");
const { PostModel } = require("../database/postModel");
const { UserModel } = require("../database/userModel");

const addPost = async (userId, postData) => {
  console.log("postData:", postData);
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User does not exist");
  }

  const post = await PostModel.create({
    postImage: postData.postImage,
    postDescription: postData.postDescription,
    author: {
      _id: user._id,
      name: user.name,
      image: user.image,
      defaultImage: user.defaultImage,
    },
  });

  return post;
};

const getPost = async () => {
  const posts = await PostModel.find()
    .populate("author")
    .then((data) => data)
    .catch((err) => err);
  return posts;
};

const patchPost = async (userId, postId, patchData) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  let post = await PostModel.findById(postId);

  if (!post) {
    throw new Error("Post does not exist");
  }
  if (String(post.author._id) !== String(user._id)) {
    throw new Error("You can't edit this post");
  }

  post.set({
    postImage: patchData.postImage,
    postDescription: patchData.postDescription,
  });
  await post.save();

  const updatedPost = await PostModel.findById(postId);
  return updatedPost;
};

const patchLikeDislike = async (userId, postId, patchData) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  let post = await PostModel.findById(postId);

  if (!post) {
    throw new Error("Post does not exist");
  }

  if (patchData.like == "inc") {
    PostModel.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } }
      // { new: true }
    ).exec();
  } else if (patchData.like == "dec") {
    PostModel.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } }
      // { new: true }
    ).exec();
  }

  if (patchData.dislike == "inc") {
    PostModel.findByIdAndUpdate(
      postId,
      { $addToSet: { dislikes: userId } }
      // { new: true }
    ).exec();
  } else if (patchData.dislike == "dec") {
    PostModel.findByIdAndUpdate(
      postId,
      { $pull: { dislikes: userId } }
      // { new: true }
    ).exec();
  }

  await post.save();
  const updatedPost = await PostModel.findById(postId);

  return updatedPost;
};

const patchFavourite = async (userId, postId, patchData) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User does not exist");
  }

  let post = await PostModel.findById(postId);

  if (!post) {
    throw new Error("Post does not exist");
  }

  if (patchData.favourite == "add") {
    PostModel.findByIdAndUpdate(
      postId,
      { $addToSet: { favourites: userId } },
      { new: true }
    ).exec();
  } else if (patchData.favourite == "rem") {
    PostModel.findByIdAndUpdate(
      postId,
      { $pull: { favourites: userId } },
      { new: true }
    ).exec();
  }

  await post.save();

  const updatedPost = await PostModel.findById(postId);
  return updatedPost;
};

const deletePost = async (userId, postId) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User does not exist");
  }

  const post = await PostModel.findById(postId);
  if (!post) {
    throw new Error("Post does not exist");
  }

  if (String(post.author._id) !== String(user._id)) {
    throw new Error("You can't delete this post");
  }

  const deletedPost = await PostModel.findByIdAndDelete(postId);

  return deletedPost;
};

module.exports = {
  addPost,
  getPost,
  patchPost,
  patchLikeDislike,
  patchFavourite,
  deletePost,
};
