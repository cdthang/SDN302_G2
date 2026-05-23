import axios from "axios";

const api = axios.create({
  // Vite dùng import.meta.env thay cho process.env
  // Tên biến đổi từ REACT_APP_ → VITE_
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export default api;
