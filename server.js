require("dotenv").config(); // Import and configure dotenv

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 5000; // Use env variable or fallback to 5000

// Enable CORS for all origins or specify origins you want to allow
app.use(
  cors({
    origin: ["http://localhost:5173", ""], // Allow the frontend origin(s)
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

app.use(express.json());

// MongoDB connection using the DB_URI environment variable
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const User = mongoose.model("User", UserSchema);

app.post("/api/auth/register", async (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword, role });
  await newUser.save();
  res.send({ message: "User registered successfully" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        // Use env variable for JWT secret
        expiresIn: "1h",
      }
    );
    res.send({ token, role: user.role });
  } else {
    res.status(400).send("Invalid credentials");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
