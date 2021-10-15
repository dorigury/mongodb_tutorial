const { Router } = require("express");
const userRouter = Router();
const mongoose = require("mongoose");
const { User, Blog, Comment } = require("../models");
//const { User } = require("../models/User");

userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
  const users = await User.find({});
});

userRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid userId" });
    const user = await User.findOne({ _id: userId });
    console.log("test");
    console.log({ user });
    return res.send({ user });
  } catch (err) {
    console.error({ err });
    return res.status(500).send({ err: err.message });
  }
});

userRouter.post("/", async (req, res) => {
  //console.log("start post test...");
  try {
    //console.log(req.body);
    //users.push({ name: req.body.name, age: req.body.age });
    let { username, name } = req.body;

    //console.log(req.body);
    if (!username) return res.status(400).send({ err: "username is required" });
    if (!name || !name.first || !name.last)
      return res
        .status(400)
        .send({ err: "Both first and last names are required" });

    const user = new User(req.body);
    await user.save();
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

userRouter.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid userId" });
    const user = await Promise.all([
      User.findOneAndDelete({ _id: userId }),
      Blog.deleteMany({ "user._id": userId }),
      Blog.updateMany(
        { "coments.user": userId },
        { $pull: { coimments: { user: userId } } }
      ),
    ]);
    await Comment.deleteMany({ user: userId });
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

userRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid userId" });
    const { age, name } = req.body;
    if (!age && !name)
      return res.status(400).send({ err: "age or name is required" });
    if (age && typeof age !== "number")
      return res.status(400).send({ err: "age must be a number" });
    if (name && typeof name.first !== "string" && typeof name.last !== "string")
      return res.status(400).send({ err: "name must be a string" });

    // let updateBody = {};
    // if (age) updateBody.age = age;
    // if (name) updateBody.name = name;
    // const user = await User.findByIdAndUpdate(userId, updateBody, {
    //     new: true,
    //   });
    let user = await User.findById(userId);
    //console.log({ userBeforeEdit: user });
    if (age) user.age = age;
    if (name) {
      user.name = name;
      await Blog.updateMany({ "user._id": userId }, { "user.name": name });
      await Blog.updateMany(
        {},
        { "comment.$[].userFullName": `${name.first} ${name.last}` },
        { arrayFilters: [{ "comment.user": userId }] }
      );
    }
    //console.log({ userAfterEdit: user });
    await user.save();
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = {
  userRouter,
};
