const express = require("express");
const app = express();
const { userRouter, blogRouter } = require("./routes");
const { generateFakeData } = require("../faker2");
//const { userRouter } = require("./routes/userRoute");
//const { blogRouter } = require("./routes/blogRoute");
//const { commentRouter } = require("./routes/commentRoute");

const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://admin:dodory21283122@monggodbtutorial.yoesd.mongodb.net/BlogService?retryWrites=true&w=majority";

const server = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //      useCreateIndex: true,
    });
    //mongoose.set("debug", true);
    //generateFakeData(100, 10, 300);
    console.log("MongoDB connected");
    app.use(express.json());

    app.use("/user", userRouter);
    app.use("/blog", blogRouter);
    //app.use("/blog/:blogId/comment", commentRouter);

    app.listen(3000, async () => {
      console.log("serverlisting on 3000");
      //for (let i = 0; i < 20; i++) {
      // console.time("loading: ");
      // await generateFakeData(10, 2, 10);
      // console.timeEnd("loading: ");
      //   //await generateFakeData(100000, 5, 20);
      //}
    });
  } catch (err) {
    console.log(err);
  }
};

server();
