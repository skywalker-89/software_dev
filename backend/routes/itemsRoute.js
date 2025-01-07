const express = require("express");
const router = express.Router();

//Post a Lost Item
router.get("/post-lost-item", (req, res) => {
  res.send("Post Lost item");
});

//Post a found item
router.get("/post-found-item", (req, res) => {
  res.send("Post a Found item");
});

//resquest match found item
// this will continue create the chat for both found and lost item users
router.get("/matched-items", (req, res) => {
  res.send("Matched a found item");
});

//delete a found item post
router.get("/del-found-item", (req, res) => {
  res.send("Delete a found item post");
});

//delete a lost item post
router.get("/del-lost-item", (req, res) => {
  res.send("Delete a lost item post");
});

module.exports = router;
