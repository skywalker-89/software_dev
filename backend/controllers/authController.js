const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/dbConfig"); // Import the pool

// Register
exports.register = async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;

  try {
    // Check if email or phone number already exists
    const emailCheck = await pool.query(
      "SELECT * FROM public.users WHERE email = $1",
      [email]
    );
    const phoneCheck = await pool.query(
      "SELECT * FROM public.users WHERE phone_number = $1",
      [phoneNumber]
    );

    if (emailCheck.rows.length > 0)
      return res.status(400).json({ message: "Email already exists" });
    if (phoneCheck.rows.length > 0)
      return res.status(400).json({ message: "Phone number already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      "INSERT INTO public.users (email, password_hash, first_name, last_name, phone_number, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id, email, first_name, last_name, phone_number",
      [email, hashedPassword, firstName, lastName, phoneNumber]
    );

    const user = result.rows[0]; // Get inserted user data
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error inserting user: ", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login
exports.login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Check if user exists by email or phone number
    const result = await pool.query(
      "SELECT * FROM public.users WHERE email = $1 OR phone_number = $1",
      [emailOrPhone]
    );

    const user = result.rows[0];

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid email/phone or password" });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid email/phone or password" });

    // Generate token
    const token = jwt.sign({ id: user.id }, "jwt_secret_key", {
      expiresIn: "365d",
    });
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
      },
    });
  } catch (error) {
    console.error("Error logging in: ", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Logout
exports.logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM public.users WHERE id = $1 RETURNING id",
      [req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account: ", error);
    res.status(500).json({ message: "Error deleting account", error });
  }
};
