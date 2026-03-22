import { useEffect, useState } from "react";
import api, { getAuthConfig } from "../../utils/api";

const Card = ({ title, value, hint }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
    <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
    {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}
  </div>
);

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/stats", getAuthConfig());
      setStats(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Khong the tai thong ke");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="rounded-xl bg-white p-4">Dang tai thong ke...</div>;
  }

  if (!stats) {
    return <div className="rounded-xl bg-white p-4">Khong co du lieu thong ke.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Admin Overview</h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total Users" value={stats.users?.totalUsers || 0} hint={`Active ${stats.users?.activeUsers || 0} • Banned ${stats.users?.bannedUsers || 0}`} />
        <Card title="Total Posts" value={stats.posts?.totalPosts || 0} hint={`Pending ${stats.posts?.pendingPosts || 0} • Approved ${stats.posts?.approvedPosts || 0}`} />
        <Card title="Pending Reports" value={stats.reports?.pendingReports || 0} hint={`Total ${stats.reports?.totalReports || 0}`} />
        <Card title="Transactions" value={stats.transactions?.totalTransactions || 0} hint={`Commission ${Number(stats.transactions?.totalCommission || 0).toLocaleString()} VND`} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Marketplace Snapshot</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Pending</p>
            <p className="text-2xl font-black">{stats.posts?.pendingPosts || 0}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Approved</p>
            <p className="text-2xl font-black">{stats.posts?.approvedPosts || 0}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Sold</p>
            <p className="text-2xl font-black">{stats.posts?.soldPosts || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
