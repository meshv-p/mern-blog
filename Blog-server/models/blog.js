let mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Must Provide title of blog"],
    },
    desc: {
      type: String,
      required: [true, "Must Provide desc of blog"],
    },
    tag: [String],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pic: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
