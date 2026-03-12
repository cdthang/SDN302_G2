import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

// Hàm tạo mã OTP 6 chữ số
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const register = async (req, res) => {
  try {
    const { username, email, password, full_name, phone, address } = req.body;

    // Kiểm tra user tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút

    const user = new User({
      username,
      email,
      password: hashedPassword,
      full_name,
      phone,
      address,
      otp,
      otpExpiry,
    });

    await user.save();
    await sendEmail(
      email,
      "Xác nhận tài khoản của bạn",
      `Mã xác nhận của bạn là: ${otp}`,
    );

    res
      .status(201)
      .json({
        message:
          "Đăng ký thành công. Vui lòng kiểm tra email để nhận mã xác nhận.",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyAccount = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });

    user.status = "active";
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({
      message: "Xác nhận tài khoản thành công. Bạn có thể đăng nhập.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    if (user.status !== "active")
      return res
        .status(403)
        .json({ message: "Tài khoản chưa được xác nhận email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(
      email,
      "Khôi phục mật khẩu",
      `Mã xác minh của bạn là: ${otp}`,
    );
    res.json({ message: "Mã xác minh đã được gửi về email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
      email,
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
