import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import api, { getAuthConfig } from "../utils/api";
import { getStoredUser } from "../utils/auth";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80";

const toImageUrl = (images) => {
  const first = Array.isArray(images) && images.length > 0 ? images[0] : "";
  if (!first) return FALLBACK_IMAGE;
  if (first.startsWith("http://") || first.startsWith("https://")) return first;
  const normalized = first.replace(/\\/g, "/").replace(/^\/+/, "");
  return `/${normalized}`;
};

function Posts() {
  const user = getStoredUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState({ search: "", category: "" });
  const [reportState, setReportState] = useState({ postId: "", reason: "" });
  const [buyingPostId, setBuyingPostId] = useState("");

  const formatter = useMemo(
    () => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }),
    []
  );

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (query.search) params.search = query.search;
      if (query.category) params.category = query.category;
      const res = await api.get("/posts", { params });
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      alert(error.response?.data?.message || "Khong the tai bai dang");
    } finally {
      setLoading(false);
    }
  }, [query.search, query.category]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const submitReport = async () => {
    if (!reportState.postId || !reportState.reason.trim()) return;
    try {
      await api.post(
        "/reports",
        { postId: reportState.postId, reason: reportState.reason.trim() },
        getAuthConfig()
      );
      alert("Da gui report cho admin.");
      setReportState({ postId: "", reason: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Khong the gui report");
    }
  };

  const handleBuyPost = async (post) => {
    if (!user) {
      alert("Vui long dang nhap de mua bai dang");
      return;
    }

    const numericPrice = Number(post.price || 0);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      alert("Bai dang nay chua co gia hop le de tao giao dich");
      return;
    }

    if (!window.confirm(`Xac nhan mua "${post.title}" voi gia ${formatter.format(numericPrice)}?`)) {
      return;
    }

    setBuyingPostId(post._id);
    try {
      await api.post(
        "/transactions",
        {
          type: "sale",
          amount: numericPrice,
          postId: post._id,
          paymentMethod: "manual",
        },
        getAuthConfig()
      );
      alert("Tao giao dich mua hang thanh cong");
      fetchPosts();
    } catch (error) {
      alert(error.response?.data?.message || "Khong the tao giao dich mua hang");
    } finally {
      setBuyingPostId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-3xl font-black">Marketplace</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_240px_140px]">
            <input
              placeholder="Tim theo tieu de"
              value={query.search}
              onChange={(e) => setQuery((prev) => ({ ...prev, search: e.target.value }))}
              className="rounded-xl border border-slate-300 px-4 py-2"
            />
            <input
              placeholder="Category"
              value={query.category}
              onChange={(e) => setQuery((prev) => ({ ...prev, category: e.target.value }))}
              className="rounded-xl border border-slate-300 px-4 py-2"
            />
            <button
              onClick={fetchPosts}
              className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white"
            >
              Loc
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Dang tai...</div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Khong co bai dang.</div>
          ) : (
            posts.map((post) => {
              const ownPost = user?.id === post.userId;
              return (
                <article key={post._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
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
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {post.category || "others"}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">{post.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.description}</p>
                    <p className="mt-3 text-lg font-black text-slate-900">
                      {formatter.format(Number(post.price || 0))}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                    {(post.tags || []).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">#{tag}</span>
                    ))}
                    </div>

                    {!ownPost ? (
                      <button
                        onClick={() => handleBuyPost(post)}
                        disabled={buyingPostId === post._id}
                        className="mt-4 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {buyingPostId === post._id ? "Dang tao giao dich..." : "Mua ngay"}
                      </button>
                    ) : (
                      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-600">
                        Day la bai dang cua ban
                      </div>
                    )}

                    {user && !ownPost && (
                      <div className="mt-3 space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                        <p className="text-xs font-semibold text-amber-800">Bao cao bai dang</p>
                        <input
                          value={reportState.postId === post._id ? reportState.reason : ""}
                          onChange={(e) => setReportState({ postId: post._id, reason: e.target.value })}
                          placeholder="Ly do report"
                          className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm"
                        />
                        <button
                          onClick={submitReport}
                          className="w-full rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white"
                        >
                          Gui report
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Posts;