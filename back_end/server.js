import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import postRoutes from "./routes/post.routes.js";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
// Connect DB
connectDB();

app.get("/", (req, res) => {
  res.send("GreenLoop API Running");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));