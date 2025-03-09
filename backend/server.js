const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("./config/passportConfig"); // Import Passport
const passportFacebook = require("./config/passportFacebook"); // Facebook Passport
const http = require("http"); // Required for Socket.io
const connectDB = require("./config/chatDB"); // MongoDB Connection
const initializeSocket = require("./config/socket"); // Import Socket.io logic

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app); // Create HTTP server for WebSockets

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const indexRoutes = require("./routes/index"); // Adjust the path if your routes are organized in a different way
const authRoutes = require("./routes/authRoutes");
const itemsRoutes = require("./routes/itemsRoute");
const emailRoutes = require("./routes/emailRoutes");
const chatRoutes = require("./routes/chatRoutes"); // Chat API Routes
const verificationRoutes = require("./routes/verificationRoutes");

// 🟢 Session Middleware (Required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Change this to a secure secret in production
    resave: false,
    saveUninitialized: false,
  })
);

// 🟢 Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passportFacebook.initialize());
app.use(passportFacebook.session());

// Use routes
app.use("/index", indexRoutes); // Prefix your routes with /api
app.use("/auth", authRoutes);
app.use("/items", itemsRoutes);
app.use("/email", emailRoutes);
app.use("/chat", chatRoutes); // Chat routes
app.use("/verification", verificationRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Initialize WebSocket after starting the server
const io = initializeSocket(server);

// Export the io instance to use it elsewhere in the app
module.exports = { io };

// Port configuration
const PORT = process.env.PORT || 1111;
server.listen(PORT, "::", () => {
  console.log(`✅ Server running on http://localhost:${PORT} (IPv4 & IPv6)`);
});
