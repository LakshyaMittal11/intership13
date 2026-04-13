const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MySQL connection (IMPORTANT FIX)
const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("DB Connected ✅");
  }
});

// ✅ Signup
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Missing fields");
    }

    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashed],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("DB Error");
        }
        res.send("User Registered ✅");
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// ✅ Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).send("DB Error");

      if (result.length === 0) {
        return res.send({ message: "User not found" });
      }

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.send({ message: "Wrong password" });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

      res.json({ token });
    }
  );
});

// ✅ Protected route
app.get("/dashboard", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) return res.send("No token");

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.send("Welcome to Dashboard 🎉");
  } catch {
    res.send("Invalid token");
  }
});

// ✅ PORT FIX
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running 🚀"));