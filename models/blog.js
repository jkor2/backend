const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  post: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

BlogSchema.methods.like = function () {
  this.likes += 1;
  return this.save();
};

BlogSchema.methods.dislike = function () {
  this.dislikes += 1;
  return this.save();
};

module.exports = mongoose.model("Blog", BlogSchema);
