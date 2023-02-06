const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    posted_by: {
      type: String,
      required: true,
    },
    posted_in: {
      type: String,
      required: true,
    },
    upvotes: {
      type: [String],
      required: false,
      default: [],
    },
    downvotes: {
      type: [String],
      required: false,
      default: [],
    },
    comments: {
      type: [
        {
          username: String,
          comment_text: String,
        },
      ],
      required: false,
      default: [],
    },
  },
  { timestamps: true }
);

postSchema.plugin(AutoIncrement, { inc_field: "id" });
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
