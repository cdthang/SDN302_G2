import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, Trash2 } from "lucide-react";

export default function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/posts", config);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/posts/${id}/approve`, {}, config);
      fetchPosts();
    } catch (err) {
      alert("Lỗi khi duyệt bài");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài đăng này?")) {
      try {
        await axios.delete(`http://localhost:8000/api/posts/${id}`, config);
        fetchPosts();
      } catch (err) {
        alert("Lỗi khi xóa bài");
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Post Moderation</h2>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
              <th className="px-6 py-4">Tiêu đề</th>
              <th className="px-6 py-4">Danh mục</th>
              <th className="px-6 py-4">Giá</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-bold text-slate-900">{p.title}</td>
                <td className="px-6 py-4 text-slate-500">{p.category}</td>
                <td className="px-6 py-4 font-mono">{Number(p.price).toLocaleString()}đ</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                    p.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {p.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(p._id)}
                      className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      title="Duyệt bài"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Xóa bài"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
