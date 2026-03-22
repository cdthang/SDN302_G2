import { useCallback, useEffect, useState } from "react";
import api, { getAuthConfig } from "../../utils/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", status: "" });

  const fetchUsers = useCallback(async (currentFilters = filters) => {
    setLoading(true);
    try {
      const params = {};
      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.status) params.status = currentFilters.status;

      const res = await api.get("/admin/users", { params, ...getAuthConfig() });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      alert(error.response?.data?.message || "Khong the tai user list");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers(filters);
  }, [fetchUsers, filters]);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { status }, getAuthConfig());
      fetchUsers(filters);
    } catch (error) {
      alert(error.response?.data?.message || "Khong the cap nhat status user");
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black">User Management</h2>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_120px]">
        <input
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          placeholder="Search username/email"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">All status</option>
          <option value="active">active</option>
          <option value="banned">banned</option>
          <option value="unverified">unverified</option>
        </select>
        <button onClick={fetchUsers} className="rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white">Apply</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Posts</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="px-4 py-5 text-slate-500">Dang tai...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="px-4 py-5 text-slate-500">Khong co user.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{u.full_name || u.username}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase">{u.status}</span>
                  </td>
                  <td className="px-4 py-3">{u.postCount || 0}</td>
                  <td className="px-4 py-3">
                    {u.status === "banned" ? (
                      <button onClick={() => setStatus(u._id, "active")} className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                        Unban
                      </button>
                    ) : (
                      <button onClick={() => setStatus(u._id, "banned")} className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white">
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
