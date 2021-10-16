const express = require("express");
const app = express();
const { userRouter, blogRouter } = require("./routes");
const { generateFakeData } = require("../faker2");
//const { userRouter } = require("./routes/userRoute");
//const { blogRouter } = require("./routes/blogRoute");
//const { commentRouter } = require("./routes/commentRoute");

const mongoose = require("mongoose");

// const MONGO_URI =
//   "mongodb+srv://admin:dodory21283122@monggodbtutorial.yoesd.mongodb.net/BlogService?retryWrites=true&w=majority";

//const { MONGO_URI } = process.env;
//console.log(MONGO_URI);
//if (!MONGO_URI) console.error("MONGO_URI is required!!!");

const server = async () => {
  try {
    const { MONGO_URI, PORT } = process.env;

    if (!MONGO_URI) throw new Error("MONGO_URI is required!!!");
    if (!PORT) throw new Error("PORT is required!");

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

    app.listen(PORT, async () => {
      console.log(`erverlisting on ${PORT}`);
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
