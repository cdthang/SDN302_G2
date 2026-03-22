import { useEffect, useState } from "react";
import api, { getAuthConfig } from "../../utils/api";

export default function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports", getAuthConfig());
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      alert(error.response?.data?.message || "Khong the tai reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const review = async (id, action) => {
    const adminNote = window.prompt("Admin note (optional):", "") || "";
    try {
      await api.patch(`/reports/${id}/review`, { action, adminNote }, getAuthConfig());
      fetchReports();
    } catch (error) {
      alert(error.response?.data?.message || "Khong the xu ly report");
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black">Report Moderation</h2>

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-500">Dang tai...</div>
        ) : reports.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-500">Chua co report nao.</div>
        ) : (
          reports.map((report) => (
            <div key={report._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">Post</p>
                  <p className="font-bold text-slate-900">{report.postId?.title || "Unknown post"}</p>
                  <p className="mt-2 text-sm text-slate-700">Reason: {report.reason}</p>
                  {report.details ? <p className="text-sm text-slate-600">Details: {report.details}</p> : null}
                  <p className="mt-2 text-xs text-slate-500">Reporter: {report.reporterId?.email || "-"}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase">{report.status}</span>
              </div>

              {report.status === "pending" ? (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => review(report._id, "resolved")}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => review(report._id, "dismissed")}
                    className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Dismiss
                  </button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
