const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemsController");
const upload = require("../config/multerConfig"); // 🔹 Import Multer configuration

// 🟢 Post a Lost Item (Multiple Images)
router.post(
  "/post-lost-item",
  upload.array("images", 10),
  itemsController.postLostItem
);

// 🟢 Post a Found Item (Multiple Images)
router.post(
  "/post-found-item",
  upload.array("images", 10),
  itemsController.postFoundItem
);

// 🟢 Request Match Found Item
router.get("/matched-items", itemsController.requestMatch);

// 🟢 Delete a Found Item Post
router.delete("/del-found-item/:id", itemsController.deleteFoundItem);

// 🟢 Delete a Lost Item Post
router.delete("/del-lost-item/:id", itemsController.deleteLostItem);

// 🟢 Get All Lost Items
router.get("/lost-items", itemsController.getLostItems);

// 🟢 Get All Found Items
router.get("/found-items", itemsController.getFoundItems);

router.get("/:id", itemsController.getItemById);

router.get("/specified/:id", itemsController.getItemBySpecificId);

// 🟢 Claim an Item
router.put("/claim-item/:id", itemsController.setClaimItem);

// get all items
router.get("/getall/all", itemsController.getAllItems);

module.exports = router;
