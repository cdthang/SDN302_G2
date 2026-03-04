import Post from "../models/Post.js";
import { classifyPost } from "../services/aiService.js";

export const createPost = async (req, res) => {
  try {
    const { title, description, images, userId } = req.body;

    const aiResult = await classifyPost(title, description);

    const newPost = new Post({
      title,
      description,
      images,
      userId,
      category: aiResult.category,
      tags: aiResult.tags,
      status: "Pending",
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};