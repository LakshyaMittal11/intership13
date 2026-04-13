const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("MySQL Connected");
});

// Signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashed],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("User Registered");
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (result.length === 0) return res.send("User not found");

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) return res.send("Wrong password");

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

      res.json({ token });
    }
  );
});

// Protected route
app.get("/dashboard", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) return res.send("No token");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.send("Welcome to Dashboard 🎉");
  } catch {
    res.send("Invalid token");
  }
});

app.listen(5000, () => console.log("Server running"));