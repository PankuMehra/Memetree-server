const { CommentModel } = require("../database/commentModel");
const { PostModel } = require("../database/postModel");
const { UserModel } = require("../database/userModel");

const addComment = async (userId, postId, commentData) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User does not exist");
  }

  const post = await PostModel.findById(postId);

  if (!post) {
    throw new Error("Post does not exist");
  }

  const comment = await CommentModel.create({
    content: commentData.content,
    author: {
      _id: user._id,
      name: user.name,
      image: user.image,
    },
    post: {
      _id: user._id,
      title: post.postDescription,
    },
  });
  return comment;
};

module.exports = {
  addComment,
};
