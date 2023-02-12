const { UserModel } = require("../database/userModel");
const { PostModel } = require("../database/postModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/index");

const register = async ({ name, email, password }) => {
  const exist = await UserModel.findOne({
    email,
  });

  if (exist) {
    throw new Error("This email is already exist");
  }

  password = bcryptjs.hashSync(password);

  let user = await UserModel.create({
    name,
    email,
    password,
  });

  user = user.toJSON();

  delete user.password;
  return user;
};

const login = async ({ email, password }) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("This email is not registered");
  }

  const savedPassword = await UserModel.findOne({ email }).select("password");

  const match = bcryptjs.compareSync(password, savedPassword.password);

  if (!match) {
    throw new Error("Incorrect Password");
  }

  const Juser = user.toJSON();
  const userId = Juser._id;
  const token = jwt.sign(Juser, config.JWT_SECRET_KEY);
  const tokenData = { token, userId };
  return tokenData;
};

const getProfile = async (userId) => {
  const user = await UserModel.findOne({
    _id: userId,
  });
  if (!user) {
    throw new Error("User does not exist");
  }
  const JUser = user.toJSON();
  const userPosts = await PostModel.find({ author: userId }).exec();
  const newUser = {
    ...JUser,
    userPosts: userPosts,
  };
  return newUser;
};

// const patchUserFollower = async (userId, followingId, patchData) => {
//   const user = await UserModel.find({
//     _id: userId,
//   });

//   if (!user) {
//     throw new Error("Not logged in");
//   }

//   const followingUser = await UserModel.find({
//     _id: followingId,
//   });

//   if (!followingUser) {
//     throw new Error("User doesn't exist");
//   }

//   if (patchData.following == true) {
//     UserModel.findByIdAndUpdate(
//       userId,
//       { $addToSet: { following: followingId } },
//       { new: true }
//     ).exec();
//   } else if (patchData.following == false) {
//     UserModel.findByIdAndUpdate(
//       userId,
//       { $pull: { following: followingId } },
//       { new: true }
//     ).exec();
//   }
// };

const patchUserFollow = async (userId, followingId, patchData) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("Not logged in");
  }

  const followingUser = await UserModel.findById(followingId);

  if (!followingUser) {
    throw new Error("User doesn't exist");
  }

  if (patchData.following === true) {
    UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { following: followingId } }
      // { new: true }
    ).exec();
    UserModel.findByIdAndUpdate(
      followingId,
      { $addToSet: { followers: userId } }
      // { new: true }
    ).exec();
  } else if (patchData.following === false) {
    UserModel.findByIdAndUpdate(
      userId,
      { $pull: { following: followingId } }
      // { new: true }
    ).exec();
    UserModel.findByIdAndUpdate(
      followingId,
      { $pull: { followers: userId } }
      // { new: true }
    ).exec();
  }
  await user.save();

  const updatedUser = await UserModel.findById(userId);
  return updatedUser;
};

module.exports = {
  register,
  login,
  getProfile,
  patchUserFollow,
};
