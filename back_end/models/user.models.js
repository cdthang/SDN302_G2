import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: {
      type: String,
      enum: ["unverified", "active", "banned"],
      default: "unverified",
    },

   
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
