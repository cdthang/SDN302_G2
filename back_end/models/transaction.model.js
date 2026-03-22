import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["sale", "donation"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    commissionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    commissionAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    netAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    payerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: false,
    },
    charityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charity",
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
    },
    paymentMethod: {
      type: String,
      default: "manual",
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
