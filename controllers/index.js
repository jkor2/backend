const asynchandler = require("express-async-handler");
require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require("../models/blog");

exports.test2 = asynchandler(async (req, res) => {
  res.send("Hello WOrld213feew");
});

//Signup post (Need to update name)
exports.testPost = asynchandler(async (req, res) => {
  try {
    // See if the account already exists
    const hasAccount = await User.findOne({ email: req.body.email });
    if (hasAccount == null) {
      //Hashing the users password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      //Creating new user through User model
      const newUser = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        fav_news: [],
        password: hash,
      });

      //Saving user to Database
      const saveUser = newUser.save();

      //Success Status sent back
      res.json({ status: 200, text: "User Added" });
    } else {
      res.json({ status: 500, text: "Account already exists" });
    }
  } catch (err) {
    //Error Status Sent back
    res.json({ status: 500, text: "User Signup Failed", error: err });
  }
});
// Create a post
exports.createPost = asynchandler(async (req, res) => {
  // Find user
  // const hasAccount = await User.findOne({ _id: "admin@admin.com" });

  try {
    // Parse text
    // Create new instance of post model
    const post = new Post({
      user: req.body.user,
      title: req.body.title,
      post: req.body.content,
    });

    // Save
    post.save();
    // Response
    res.json({ status: 200, text: "Sucess" });
  } catch (err) {
    res.json({ status: 403, text: "Post failed to save" });
  }
});

// Gets all the posts stored in Mongo
exports.getPosts = asynchandler(async (req, res) => {
  try {
    // Pupolating the user object, according the posts they created
    const posts = await Post.find({}).populate("user");
    posts.reverse();
    res.json({ status: 200, content: true, posts: posts });
  } catch (err) {
    res.json({ status: 403, content: false, error: err });
    console.log(err);
  }
});

exports.userUpdate = asynchandler(async (req, res) => {
  /**
   *
   *
   * Need to clean clean input fields before sending to DB
   *
   *
   */

  // Assuming req.body contains the updated values for email, fname, and lname
  const { email, fname, lname } = req.body;

  // Find the user by email and update the specified fields
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.body._id },
    { $set: { email, fname, lname } },
    { new: true } // This option returns the modified document rather than the original
  );

  // Check if the user was found and updated
  if (updatedUser) {
    res.json({ status: 200, account: updatedUser });
  } else {
    res.json({ status: 403, account: false });
  }
});

//Login Post
exports.loginPost = asynchandler(async (req, res) => {
  //Searching for users account via email
  const hasAccount = await User.findOne({ email: req.body.email });

  if (hasAccount == null) {
    //If no account is found
    res.json({ status: 500, account: false });
  } else {
    //Compare passwords using bcrypt
    bcrypt.compare(req.body.password, hasAccount.password, (err, result) => {
      if (result) {
        //if the result is valid, sign a JWT Token
        jwt.sign({ user: hasAccount }, process.env.JWTKEY, (err, token) => {
          if (err) {
            //Check for any errors
            return res.json({ status: 500, account: false, user: null });
          } else {
            //No error, send user info back
            return res.json({
              token: token,
              account: true,
            });
          }
        });
      } else {
        //Error - send error message
        return res.json({ status: 500, account: false, user: null });
      }
    });
  }
});

// TO-DO
// Check the users fav news article length, dont let more than 20

exports.addFav = asynchandler(async (req, res) => {
  // Get the current user
  const current_user = await User.findOne({ _id: req.body.id });

  //Validate Request
  if (current_user.fav_news.length > 0) {
    if (current_user.fav_news.length > 30) {
      // Remove last saved article once limit has been reached
      current_user.fav_news.pop(-1);
    }

    //Comparing what is already stored to prevent duplicates
    for (let i = 0; i < current_user.fav_news.length; i++) {
      if (current_user.fav_news[i].headline == req.body.headline) {
        //If there is a duplicate, alert duplicate
        res.json({
          status: 200,
          action: "You have already saved this article",
          headline: "You have already saved this article",
        });
        return;
      }
    }

    //No duplicate, update the current users favs by appending to the end
    current_user
      .updateOne({ fav_news: [req.body, ...current_user.fav_news] })
      .exec();
    res.json({
      status: 200,
      action: "Succes! Article Saved",
    });
    return;
  } else {
    //If th euser has no current saved articles, save it
    current_user
      .updateOne({ fav_news: [...current_user.fav_news, req.body] })
      .exec();
    res.json({
      status: 200,
      action: "Succes! Article Saved",
    });
  }
});

// User auth to make sure they are signed in
exports.home = asynchandler(async (req, res) => {
  jwt.verify(req.token, process.env.JWTKEY, (err, authData) => {
    if (err) {
      //If the user has no account, send a false status
      res.json({ status: 403, account: false });
    } else {
      //If the user has an account, send their data
      res.json({
        status: 200,
        authData: authData,
        account: true,
      });
    }
  });
});

//Remove faviorite route
exports.removeFav = asynchandler(async (req, res) => {
  try {
    //Find user, filter for article, and remove
    await User.updateOne(
      { _id: req.body.user },
      { $pull: { fav_news: { headline: req.body.headline } } }
    );

    const current_user = await User.findOne({ _id: req.body.user });
    //Send updated user data
    res.json({
      status: 200,
      action: "Article Removed Sucessfully",
      authData: current_user,
    });
  } catch (error) {
    //No article found, send error
    res.json({
      status: 500,
      action: "Internal Error",
    });
  }
});

//Get current users data - when needed
exports.getNews = asynchandler(async (req, res) => {
  const current_user = await User.findOne({ _id: req.body._id });
  res.json({
    status: 200,
    authData: current_user,
  });
});

// Handle password change
exports.handlePassword = asynchandler(async (req, res) => {
  // Find users account
  const account = await User.findOne({ _id: req.body._id });

  if (account == null) {
    // If no account is found
    res.json({ status: 403, account: false });
  } else {
    // Compare passwords
    const result = await bcrypt.compare(req.body.password, account.password);

    if (result) {
      // If the result is true, salth and hash and update users password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.npassword, salt);

      // Update the password
      const updatedAccount = await account.updateOne(
        { $set: { password: hash } },
        { new: true } // This option returns the modified document rather than the original
      );

      // Check if the update was successful
      if (updatedAccount) {
        res.json({ status: 200, account: true });
      } else {
        res.json({
          status: 500,
          account: false,
          error: "Failed to update password",
        });
      }
    } else {
      // Error - send error message
      res.json({ status: 403, account: false, error: "Invalid password" });
    }
  }
});
