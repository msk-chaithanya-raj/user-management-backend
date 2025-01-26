const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://chaithubrazil:chaithu2005@universal.nt8uv.mongodb.net/?retryWrites=true&w=majority&appName=universal",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

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
    const token = jwt.sign({ id: user._id, role: user.role }, "secret", {
      expiresIn: "1h",
    });
    res.send({ token, role: user.role });
  } else {
    res.status(400).send("Invalid credentials");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
