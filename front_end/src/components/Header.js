import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
            R
          </div>
          <div>
            <p className="text-lg font-bold">ReUni</p>
            <p className="text-xs text-slate-500">Thu mua đồ cũ cho sinh viên</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/posts" className="text-sm text-slate-600 hover:text-slate-900">Marketplace</Link>
          {user && <Link to="/my-posts" className="text-sm text-slate-600 hover:text-slate-900">My Posts</Link>}
          {user && <Link to="/transactions" className="text-sm text-slate-600 hover:text-slate-900">Transactions</Link>}
          <Link to="/charities" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Từ thiện</Link>
          {user && <Link to="/profile" className="text-sm text-slate-600 hover:text-slate-900">Profile</Link>}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-sm font-semibold text-slate-900 hover:text-emerald-600">Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Chào, {user.full_name || user.username}</span>
              <button 
                onClick={handleLogout}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium md:block">
                Đăng nhập
              </Link>
              <Link to="/create-post" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02]">
                Bán đồ ngay
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
