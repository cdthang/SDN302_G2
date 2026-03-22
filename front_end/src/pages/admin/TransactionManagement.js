import { useEffect, useMemo, useState } from "react";
import api, { getAuthConfig } from "../../utils/api";

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const money = useMemo(
    () => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }),
    []
  );

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transactions", getAuthConfig());
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      alert(error.response?.data?.message || "Khong the tai transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black">Transaction Management</h2>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Commission</th>
              <th className="px-4 py-3">Net</th>
              <th className="px-4 py-3">Payer</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="px-4 py-5 text-slate-500">Dang tai...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan="7" className="px-4 py-5 text-slate-500">Chua co giao dich.</td></tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold uppercase">{tx.type}</td>
                  <td className="px-4 py-3">{money.format(Number(tx.amount || 0))}</td>
                  <td className="px-4 py-3">{money.format(Number(tx.commissionAmount || 0))}</td>
                  <td className="px-4 py-3">{money.format(Number(tx.netAmount || 0))}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{tx.payerId?.email || "guest"}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{tx.postId?.title || tx.charityId?.title || "-"}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase">{tx.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
