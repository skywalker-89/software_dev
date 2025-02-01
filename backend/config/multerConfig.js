const multer = require("multer");

// 🔹 Store images in memory (no local saving)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
});

module.exports = upload;
