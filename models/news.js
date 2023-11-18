const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//News Model
const NewsSchema = new Schema({
  headline: { type: String, required: true },
  source: { type: String, required: true },
  url: { type: String, required: true },
  time: { type: String, required: true },
});

module.exports = mongoose.model("News", NewsSchema);
