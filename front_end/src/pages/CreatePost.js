import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api, { getAuthConfig } from "../utils/api";

function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);

      for (const file of images) {
        formData.append("images", file);
      }

      await api.post("/posts", formData, {
        ...getAuthConfig(),
        headers: {
          ...getAuthConfig().headers,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Bài đăng đã được tạo và đang chờ admin duyệt.");
      navigate("/my-posts");
    } catch (error) {
      alert(error.response?.data?.message || "Không thể tạo bài đăng");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-3xl font-black text-slate-900">Dang ban bai moi</h2>
          <p className="mt-2 text-sm text-slate-500">
            He thong se dung AI de goi y category va tags.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Tieu de</label>
              <input
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Mo ta</label>
              <textarea
                name="description"
                rows="5"
                required
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Gia (VND)</label>
              <input
                name="price"
                type="number"
                min="0"
                required
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Hinh anh (toi da 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files || []).slice(0, 5))}
                className="block w-full text-sm text-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {submitting ? "Dang gui..." : "Tao bai dang"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;