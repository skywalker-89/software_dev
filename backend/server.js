const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const indexRoutes = require("./routes/index"); // Adjust the path if your routes are organized in a different way
const authRoutes = require("./routes/authRoutes");
const itemsRoutes = require("./routes/itemsRoute");

// Use routes
app.use("/index", indexRoutes); // Prefix your routes with /api
app.use("/auth", authRoutes);
app.use("/items", itemsRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Port configuration
const PORT = process.env.PORT || 1111;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
