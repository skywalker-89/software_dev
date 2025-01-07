const express = require("express");
const router = express.Router();

// Example route
router.get("/test", (req, res) => {
  res.send("Test route working!");
});

module.exports = router;
