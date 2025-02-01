const cloudinary = require("../config/cloudinaryConfig");
const pool = require("../config/dbConfig");

// 🟢 Post Lost Item with Cloudinary Upload
exports.postLostItem = async (req, res) => {
  try {
    const {
      title,
      description,
      last_seen_location,
      latitude,
      longitude,
      owner_id,
    } = req.body;
    const files = req.files;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    // 🔹 Upload images to Cloudinary
    const imageUrls = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "lost-and-found" },
              (error, cloudinaryResult) => {
                if (error) reject(error);
                else resolve(cloudinaryResult.secure_url);
              }
            );
            uploadStream.end(file.buffer);
          })
      )
    );

    // 🔹 Insert into the database
    const result = await pool.query(
      `INSERT INTO lost_items (owner_id, title, image_urls, description, last_seen_location, latitude, longitude, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'lost', NOW()) RETURNING *`,
      [
        owner_id,
        title,
        imageUrls,
        description,
        last_seen_location,
        latitude,
        longitude,
      ]
    );

    res.status(201).json({
      message: "Lost item posted successfully",
      item: result.rows[0],
    });
  } catch (error) {
    console.error("Error posting lost item:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Post Found Item with Cloudinary Upload
exports.postFoundItem = async (req, res) => {
  try {
    const {
      title,
      description,
      found_location,
      latitude,
      longitude,
      founder_id,
    } = req.body;
    const files = req.files;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    // 🔹 Upload images to Cloudinary
    const imageUrls = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "lost-and-found" },
              (error, cloudinaryResult) => {
                if (error) reject(error);
                else resolve(cloudinaryResult.secure_url);
              }
            );
            uploadStream.end(file.buffer);
          })
      )
    );

    // 🔹 Insert into PostgreSQL
    const result = await pool.query(
      `INSERT INTO found_items (founder_id, title, image_urls, description, found_location, latitude, longitude, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'found', NOW()) RETURNING *`,
      [
        founder_id,
        title,
        imageUrls,
        description,
        found_location,
        latitude,
        longitude,
      ]
    );

    res.status(201).json({
      message: "Found item posted successfully",
      item: result.rows[0],
    });
  } catch (error) {
    console.error("Error posting found item:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Get All Lost Items (Exclude Claimed)
exports.getLostItems = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM lost_items WHERE status = 'lost' ORDER BY created_at DESC"
    );

    // 🔹 Ensure image_urls is an array
    const formattedItems = result.rows.map((item) => ({
      ...item,
      image_urls: Array.isArray(item.image_urls) ? item.image_urls : [],
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error("Error getting lost items:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Get All Found Items (Exclude Claimed)
exports.getFoundItems = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM found_items WHERE status = 'found' ORDER BY created_at DESC"
    );

    // 🔹 Ensure image_urls is an array
    const formattedItems = result.rows.map((item) => ({
      ...item,
      image_urls: Array.isArray(item.image_urls) ? item.image_urls : [],
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error("Error getting found items:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Request Match Found Item
exports.requestMatch = async (req, res) => {
  try {
    const { lostItemId } = req.query;

    if (!lostItemId)
      return res.status(400).json({ message: "Lost item ID is required" });

    const lostItem = await pool.query(
      "SELECT * FROM lost_items WHERE id = $1",
      [lostItemId]
    );

    if (lostItem.rows.length === 0)
      return res.status(404).json({ message: "Lost item not found" });

    const description = lostItem.rows[0].description;

    // Enable pg_trgm extension if not enabled
    await pool.query("CREATE EXTENSION IF NOT EXISTS pg_trgm");

    const result = await pool.query(
      `SELECT * FROM found_items 
       WHERE status = 'found'
       ORDER BY description % $1 DESC 
       LIMIT 1`,
      [description]
    );

    if (result.rows.length === 0)
      return res.json({ message: "No matches found" });

    res.json({ message: "Match found!", matchedItem: result.rows[0] });
  } catch (error) {
    console.error("Error finding match:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Delete a Found Item Post
exports.deleteFoundItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await pool.query(
      "SELECT image_urls FROM found_items WHERE id = $1",
      [id]
    );

    if (item.rows.length === 0)
      return res.status(404).json({ message: "Item not found" });

    await pool.query("DELETE FROM found_items WHERE id = $1", [id]);

    res.json({ message: "Found item deleted successfully" });
  } catch (error) {
    console.error("Error deleting found item:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Delete a Lost Item Post
exports.deleteLostItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await pool.query(
      "SELECT image_urls FROM lost_items WHERE id = $1",
      [id]
    );

    if (item.rows.length === 0)
      return res.status(404).json({ message: "Item not found" });

    await pool.query("DELETE FROM lost_items WHERE id = $1", [id]);

    res.json({ message: "Lost item deleted successfully" });
  } catch (error) {
    console.error("Error deleting lost item:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Get Item by ID
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM lost_items WHERE id = $1 UNION ALL SELECT * FROM found_items WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
