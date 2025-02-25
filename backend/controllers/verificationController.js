const cloudinary = require("../config/cloudinaryConfig");
const pool = require("../config/dbConfig");

// 🟢 Verify User - Upload ID and Face Picture to Cloudinary
exports.verifyUser = async (req, res) => {
  try {
    const { first_name, last_name, user_id } = req.body;
    const files = req.files; // Get uploaded images (ID + Face)

    if (!first_name || !last_name || !user_id) {
      return res.status(400).json({ message: "Missing user information" });
    }

    if (!files || files.length !== 2) {
      return res
        .status(400)
        .json({ message: "Both ID card and face picture are required" });
    }

    // 🔹 Create folder name based on user details
    const userFolder = `verifications/${first_name}_${last_name}_${user_id}`;

    // 🔹 Upload images to Cloudinary
    const uploadPromises = files.map((file, index) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: userFolder }, (error, cloudinaryResult) => {
            if (error) reject(error);
            else resolve(cloudinaryResult.secure_url);
          })
          .end(file.buffer);
      });
    });

    const [idCardUrl, facePictureUrl] = await Promise.all(uploadPromises);

    // 🔹 Return Cloudinary URLs as response
    res.status(201).json({
      message: "Verification images uploaded successfully",
      id_card_url: idCardUrl,
      face_picture_url: facePictureUrl,
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Get Verification Status by User ID
exports.getVerificationStatus = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await pool.query(
      "SELECT * FROM verifications WHERE user_id = $1",
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Verification not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching verification status:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Admin: Approve or Reject Verification
exports.updateVerificationStatus = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const result = await pool.query(
      `UPDATE verifications SET status = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *`,
      [status, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Verification not found" });
    }

    res.json({
      message: `Verification ${status}`,
      verification: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating verification status:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
