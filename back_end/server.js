require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
import postRoutes from "./routes/postRoutes.js";
import charityRoutes from "./routes/charityRoutes.js";

const app = express();

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("GreenLoop API Running");
});

app.use("/api/posts", postRoutes);
app.use("/api/charities", charityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
