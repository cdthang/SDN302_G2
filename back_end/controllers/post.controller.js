import Post from "../models/post.models.js";
import User from "../models/user.models.js";

export const createPost = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    const uploadedImages = (req.files || []).map((file) => file.path.replace(/\\/g, "/"));
    const bodyImages = Array.isArray(req.body.images) ? req.body.images : [];
    const images = uploadedImages.length > 0 ? uploadedImages : bodyImages;

    const aiResult = await classifyPost(title, description);

    const post = new Post({
      title,
      description,
      images,
      userId: req.user.id,
      category: aiResult.category,
      tags: aiResult.tags,
      status: "pending",
      price,
    });

    await post.save();
    await User.findByIdAndUpdate(req.user.id, { $inc: { postCount: 1 } });

    res.status(201).json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { search, category } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    query.status = "approved";

    const posts = await Post.find(query).sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { userId: req.user.id };

    if (status && status !== "all") {
      query.status = status;
    }

    const posts = await Post.find(query).sort({ updatedAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostsForModeration = async (req, res) => {
  try {
    const { status = "pending", search, category } = req.query;
    const query = {};

    if (status !== "all") {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const posts = await Post.find(query)
      .populate("userId", "username email full_name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    const isOwner = post.userId?.toString() === req.user.id;
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Bạn chỉ có thể cập nhật bài đăng của chính mình" });
    }

    const { title, description, price, images } = req.body;
    const uploadedImages = (req.files || []).map((file) => file.path.replace(/\\/g, "/"));

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;
    if (price !== undefined) post.price = price;
    if (uploadedImages.length > 0) {
      post.images = uploadedImages;
    } else if (Array.isArray(images)) {
      post.images = images;
    }

    if (title !== undefined || description !== undefined) {
      const aiResult = await classifyPost(post.title, post.description);
      post.category = aiResult.category;
      post.tags = aiResult.tags;
    }

    post.status = "pending";
    post.rejectReason = "";
    await post.save();

    res.json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deletePost = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    const isOwner = post.userId?.toString() === req.user.id;
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Bạn chỉ có thể xóa bài đăng của chính mình" });
    }

    await Post.findByIdAndDelete(req.params.id);

    if (post.userId) {
      await User.findByIdAndUpdate(post.userId, { $inc: { postCount: -1 } });
    }

    res.json({ message: "Đã xóa bài đăng" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approvePost = async (req, res) => {

  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: "approved", rejectReason: "" },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

export const rejectPost = async (req, res) => {
  try {
    const { reason } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", rejectReason: reason || "Rejected by admin" },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markPostAsSold = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    const isOwner = post.userId?.toString() === req.user.id;
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Bạn chỉ có thể đánh dấu đã bán cho bài đăng của chính mình" });
    }

    post.status = "sold";
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMySoldPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id, status: "sold" }).sort({ updatedAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

