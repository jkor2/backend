const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//User model
const UserSchema = new Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  fav_news: { type: Array, required: true },
});

module.exports = mongoose.model("User", UserSchema);
