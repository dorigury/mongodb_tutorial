const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
const { CommentSchema } = require("./Comment");

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isLive: { type: Boolean, required: true, default: false },
    user: {
      _id: { type: ObjectId, required: true, ref: "user" },
      username: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
    commentsCount: { type: Number, default: 0, required: true },
    //comments: [CommentSchema],
    comments: [
      {
        content: { type: String, required: true },
        user: { type: ObjectId, required: true, ref: "user" },
        blog: { type: ObjectId, required: true, ref: "blog" },
      },
    ],
  },
  { timestamps: true }
);

BlogSchema.index({ "user._id": 1, updateAt: 1 });
BlogSchema.index({ title: "text", content: "text" });

// BlogSchema.virtual("comments", {
//   ref: "comment",
//   localField: "_id",
//   foreignField: "blog",
// });

//BlogSchema.set("toObject", { virtuals: true });
//BlogSchema.set("toJSON", { virtuals: true });

const Blog = model("blog", BlogSchema);
module.exports = { Blog };
