// front_end/src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
      );
      localStorage.setItem("token", res.data.token); // Lưu token để dùng cho các tính năng khác
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      alert(
        "Lỗi đăng nhập: " + (error.response?.data?.message || "Sai thông tin"),
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full ring-1 ring-slate-200">
        <h2 className="text-3xl font-black text-center mb-6">Đăng Nhập</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition"
          >
            Đăng Nhập
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-emerald-600 font-bold hover:underline"
          >
            Tạo mới
          </Link>
        </p>
      </div>
    </div>
  );
}
