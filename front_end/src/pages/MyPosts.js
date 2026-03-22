import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import api, { getAuthConfig } from "../utils/api";
import { getStoredUser } from "../utils/auth";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80";

const toImageUrl = (images) => {
  const first = Array.isArray(images) && images.length > 0 ? images[0] : "";
  if (!first) return FALLBACK_IMAGE;
  if (first.startsWith("http://") || first.startsWith("https://")) return first;
  const normalized = first.replace(/\\/g, "/").replace(/^\/+/, "");
  return `/${normalized}`;
};

const statuses = ["all", "pending", "approved", "rejected", "sold"];

export default function MyPosts() {
  const user = getStoredUser();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);

  const money = useMemo(
    () => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }),
    []
  );

  const fetchMyPosts = async (activeFilter) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const params = {};
      if (activeFilter !== "all") params.status = activeFilter;
      const res = await api.get("/posts/me", { params, ...getAuthConfig() });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      alert(error.response?.data?.message || "Khong tai duoc bai dang cua ban");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, user?.id]);

  const handleDelete = async (id) => {
    if (!window.confirm("Xoa bai dang nay?")) return;
    try {
      await api.delete(`/posts/${id}`, getAuthConfig());
      fetchMyPosts(filter);
    } catch (error) {
      alert(error.response?.data?.message || "Khong the xoa");
    }
  };

  const handleSold = async (id) => {
    try {
      await api.patch(`/posts/${id}/sold`, {}, getAuthConfig());
      fetchMyPosts(filter);
    } catch (error) {
      alert(error.response?.data?.message || "Khong the danh dau da ban");
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editItem) return;
    try {
      await api.put(
        `/posts/${editItem._id}`,
        {
          title: editItem.title,
          description: editItem.description,
          price: Number(editItem.price || 0),
        },
        getAuthConfig()
      );
      setEditItem(null);
      fetchMyPosts(filter);
    } catch (error) {
      alert(error.response?.data?.message || "Khong the cap nhat bai dang");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-3xl font-black">My Posts</h2>
          <p className="mt-1 text-sm text-slate-500">Quan ly bai dang va lich su da ban.</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  filter === status
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-500">Dang tai...</div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-500">Chua co bai dang nao.</div>
          ) : (
            items.map((post) => (
              <article key={post._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="aspect-[4/3] w-full bg-slate-100">
                  <img
                    src={toImageUrl(post.images)}
                    alt={post.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>

                <div className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold">{post.title}</h3>
                      <p className="line-clamp-3 text-sm text-slate-600">{post.description}</p>
                      <p className="mt-2 text-lg font-black">{money.format(Number(post.price || 0))}</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                        {post.status}
                      </span>
                      {post.rejectReason ? (
                        <p className="mt-2 max-w-xs text-xs text-rose-600">Ly do reject: {post.rejectReason}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setEditItem(post)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
                    >
                      Sua
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700"
                    >
                      Xoa
                    </button>
                    {post.status === "approved" && (
                      <button
                        onClick={() => handleSold(post._id)}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                      >
                        Danh dau da ban
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-xl space-y-3 rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="text-2xl font-black">Cap nhat bai dang</h3>
            <input
              value={editItem.title}
              onChange={(e) => setEditItem((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            <textarea
              value={editItem.description}
              onChange={(e) => setEditItem((prev) => ({ ...prev, description: e.target.value }))}
              rows="4"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            <input
              type="number"
              value={editItem.price}
              onChange={(e) => setEditItem((prev) => ({ ...prev, price: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditItem(null)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2">
                Huy
              </button>
              <button type="submit" className="flex-1 rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white">
                Luu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
