const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");
const tokenVerify = require("../middlewear/jwtVerify");
const verifyToken = require("../middlewear/jwtVerify");

//Test Routes
router.get("/", controller.testPost);
//router.get("/user", controller.user);
router.post("/api/news", controller.getNews);
router.get("/api/auth", verifyToken, controller.home);

//Signup
router.post("/user/create", controller.testPost);
//Login
router.post("/login/auth", controller.loginPost);
//Process fav
router.post("/add/fav", controller.addFav);
//Delete fav
router.post("/remove/fav", controller.removeFav);
// Create a post
router.post("/create/post", controller.createPost);
// Get posts
router.get("/posts/get", controller.getPosts);
// Update user basic info
router.post("/useredit/update", controller.userUpdate);
// Update password
router.post("/useredit/password/update", controller.handlePassword);

module.exports = router;
