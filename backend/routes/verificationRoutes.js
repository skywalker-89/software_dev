const express = require("express");
const router = express.Router();
const verificationController = require("../controllers/verificationController");
const upload = require("../config/multerConfig"); // Multer for image upload

// 🟢 Submit Verification (Upload ID & Face Picture)
router.post(
  "/submit",
  upload.array("images", 2),
  verificationController.verifyUser
);

// 🟢 Get Verification Status by User ID
router.get("/:user_id", verificationController.getVerificationStatus);

// 🟢 Admin: Approve or Reject Verification
router.put(
  "/update-status/:user_id",
  verificationController.updateVerificationStatus
);

module.exports = router;
