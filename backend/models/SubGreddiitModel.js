const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subgreddiitSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    banned_keywords: {
      type: [String],
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    num_people: {
      type: Number,
      default: 1,
    },
    num_posts: {
      type: Number,
      default: 0,
    },
    followers: {
      type: [
        {
          username: String,
          blocked: Boolean,
        },
      ],
      default: [],
    },
    joining_requests: {
      type: [
        {
          username: String,
          status: {
            type: String,
            enum: ["accepted", "pending", "rejected"],
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const SubGreddiit = mongoose.model("SubGreddiit", subgreddiitSchema);

module.exports = SubGreddiit;
