const { Router } = require("express");
const blogRouter = Router();
const { Blog, User, Comment } = require("../models");
//const { Blog } = require("../models/Blog");
//const { User } = require("../models/User");
const { isValidObjectId } = require("mongoose");
const { commentRouter } = require("./commentRoute");

blogRouter.use("/:blogId/comment", commentRouter);

blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, isLive, userId } = req.body;
    if (typeof title !== "string")
      return res.status(400).send({ err: "title is required" });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is required" });
    if (isLive && typeof isLive !== "boolean")
      return res.status(400).send({ err: "isLive must be a boolean" });
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: "userId is invalid" });

    const user = await User.findById(userId);
    if (!user) return res.status(400).send({ err: "user does not exist" });

    //console.log(user);
    //let blog = new Blog({ ...req.body, user._id, user.name.last, user.name.first, user.username });
    const blog = new Blog({ ...req.body, user: user.toObject() });
    //console.log(blog);
    await blog.save();
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

blogRouter.get("/", async (req, res) => {
  try {
    let { page } = req.query;
    page = parseInt(page);
    //console.log({ page });
    let blogs = await Blog.find({})
      .sort({ updateAt: -1 })
      .skip(page * 3)
      .limit(3);
    // .populate([
    //   { path: "user" },
    //   { path: "comments", populate: { path: "user" } },
    // ]);
    return res.send({ blogs });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

blogRouter.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blogId is invalid" });
    const blog = await Blog.findOne({ _id: blogId });
    //const CommentCount = await Comment.find({ blog: blogId }).countDocuments();
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

blogRouter.put("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      res.status(400).send({ err: "blogId is invalid" });

    const { title, content } = req.body;
    if (typeof title !== "string")
      res.status(400).send({ err: "title is required" });
    if (typeof content !== "string")
      res.status(400).send({ err: "content is required" });

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { title, content },
      { new: true }
    );
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

blogRouter.patch("/:blogId/live", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      res.status(400).send({ err: "blogId is invalid" });

    const { isLive } = req.body;
    if (typeof isLive !== "boolean")
      res.status(400).send({ err: "isLive must be boolean" });

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { isLive },
      { new: true }
    );
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

module.exports = { blogRouter };
