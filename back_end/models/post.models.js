import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  images: [
    {
      type: String
    }
  ],
  category: {
    type: String
  },
  tags: [
    {
      type: String
    }
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["Pending", "approved", "sold"],
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
