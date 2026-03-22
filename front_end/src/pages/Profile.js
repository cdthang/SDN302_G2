import { useEffect, useState } from "react";
import Header from "../components/Header";
import api, { getAuthConfig } from "../utils/api";

export default function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    address: "",
    role: "",
    status: "",
    postCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchMe = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/me", getAuthConfig());
      setProfile((prev) => ({ ...prev, ...res.data }));
    } catch (error) {
      alert(error.response?.data?.message || "Khong the tai thong tin ca nhan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(
        "/auth/me",
        {
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
        },
        getAuthConfig()
      );
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Cap nhat profile thanh cong");
      fetchMe();
    } catch (error) {
      alert(error.response?.data?.message || "Khong the cap nhat profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-black">My Profile</h2>
          {loading ? (
            <p className="mt-4 text-slate-500">Dang tai...</p>
          ) : (
            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Username</label>
                  <input value={profile.username || ""} disabled className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                  <input value={profile.email || ""} disabled className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
                <input
                  value={profile.full_name || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, full_name: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
                <input
                  value={profile.phone || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Address</label>
                <input
                  value={profile.address || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div className="grid gap-4 rounded-xl bg-slate-50 p-4 md:grid-cols-3">
                <div>
                  <p className="text-xs uppercase text-slate-500">Role</p>
                  <p className="font-bold">{profile.role}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500">Status</p>
                  <p className="font-bold">{profile.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500">Post count</p>
                  <p className="font-bold">{profile.postCount || 0}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white"
              >
                {saving ? "Dang luu..." : "Luu profile"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
