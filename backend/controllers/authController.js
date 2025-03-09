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

    // Insert new user with verified set to 'not_verified'
    const result = await pool.query(
      "INSERT INTO public.users (email, password_hash, first_name, last_name, phone_number, verified, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id, email, first_name, last_name, phone_number, verified",
      [email, hashedPassword, firstName, lastName, phoneNumber, "not_verified"]
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
        verified: user.verified, // ✅ Include verified status
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

exports.googleAuthCallback = async (req, res) => {
  try {
    const profile = req.user;
    console.log("Google Profile Data:", profile); // Debugging log

    const email = profile._json.email;
    const first_name =
      profile._json.given_name ||
      profile.name?.givenName ||
      profile.displayName?.split(" ")[0];
    const last_name =
      profile._json.family_name ||
      profile.name?.familyName ||
      profile.displayName?.split(" ")[1];

    console.log("Extracted Name:", { first_name, last_name }); // Debug log

    let result = await pool.query(
      "SELECT * FROM public.users WHERE email = $1",
      [email]
    );
    let user;

    if (result.rows.length > 0) {
      user = result.rows[0];
    } else {
      // Insert new user with verified set to 'verified'
      result = await pool.query(
        "INSERT INTO public.users (email, first_name, last_name, verified, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, email, first_name, last_name, verified",
        [email, first_name, last_name, "verified"]
      );
      user = result.rows[0];
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id }, "jwt_secret_key", {
      expiresIn: "365d",
    });

    // 🔹 Redirect back to frontend with token and user data
    return res.redirect(
      `http://localhost:3000/google-auth-success?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  } catch (error) {
    console.error("Error during Google login: ", error);
    res.status(500).json({ message: "Error during Google login", error });
  }
};

exports.facebookAuthCallback = async (req, res) => {
  try {
    const profile = req.user;
    console.log("Facebook Profile Data:", profile); // Debugging log

    const email = profile.emails?.[0]?.value || null; // Facebook may not always provide email
    const first_name =
      profile.name?.givenName ||
      profile.displayName?.split(" ")[0] ||
      "Unknown";
    const last_name =
      profile.name?.familyName || profile.displayName?.split(" ")[1] || "User";

    console.log("Extracted Name:", { first_name, last_name, email }); // Debug log

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required from Facebook login." });
    }

    let result = await pool.query(
      "SELECT * FROM public.users WHERE email = $1",
      [email]
    );
    let user;

    if (result.rows.length > 0) {
      user = result.rows[0];
    } else {
      // Insert new user with verified set to 'verified'
      result = await pool.query(
        "INSERT INTO public.users (email, first_name, last_name, verified, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, email, first_name, last_name, verified",
        [email, first_name, last_name, "verified"]
      );
      user = result.rows[0];
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id }, "jwt_secret_key", {
      expiresIn: "365d",
    });

    // 🔹 Redirect back to frontend with token and user data
    return res.redirect(
      `http://localhost:3000/facebook-auth-success?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  } catch (error) {
    console.error("Error during Facebook login: ", error);
    res.status(500).json({ message: "Error during Facebook login", error });
  }
};

// 🔹 GET USER DATA (New Function)
exports.getUserData = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from token

    const result = await pool.query(
      "SELECT id, email, first_name, last_name, phone_number, verified FROM public.users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data", error });
  }
};

// GET USER DATA BY ID
exports.getUserDataById = async (req, res) => {
  const { id } = req.params; // Extract user ID from request parameters
  console.log(id);

  try {
    const result = await pool.query(
      "SELECT * FROM public.users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user data by ID:", error);
    res.status(500).json({ message: "Error fetching user data by ID", error });
  }
};
