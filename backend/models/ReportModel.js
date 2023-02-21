const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportExpirySecs = 864000;

const reportSchema = new Schema(
  {
    reported_user: {
      type: String,
      required: true,
    },
    reported_by: {
      type: String,
      required: true,
    },
    concern: {
      type: String,
      required: true,
    },
    post_text: {
      type: String,
      required: true,
    },
    subgreddiit: {
      type: String,
      required: true,
    },
    post_id: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ignored", "pending", "blocked"],
    },
  },
  { timestamps: true }
);

reportSchema.index({ createdAt: 1 }, { expireAfterSeconds: reportExpirySecs });

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
