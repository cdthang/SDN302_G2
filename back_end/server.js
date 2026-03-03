require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

app.use(express.json());

// Connect DB
connectDB();

app.get("/", (req, res) => {
  res.send("GreenLoop API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));