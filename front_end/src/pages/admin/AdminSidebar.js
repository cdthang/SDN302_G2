import React from "react";
import { LayoutDashboard, Heart, MessageSquare, LogOut } from "lucide-react";

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="w-64 bg-slate-900 text-white p-6 flex flex-col min-h-screen sticky top-0">
      <h1 className="text-2xl font-black mb-10 flex items-center gap-2">
        <LayoutDashboard className="text-emerald-500" /> Admin
      </h1>
      
      <nav className="space-y-2 flex-1">
        <button
          onClick={() => setActiveTab("charity")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            activeTab === "charity" ? "bg-emerald-600" : "hover:bg-slate-800"
          }`}
        >
          <Heart size={20} /> Charity
        </button>
        <button
          onClick={() => setActiveTab("post")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            activeTab === "post" ? "bg-emerald-600" : "hover:bg-slate-800"
          }`}
        >
          <MessageSquare size={20} /> Posts
        </button>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-2 text-slate-400 hover:text-red-400 font-medium px-4 py-3 transition border-t border-slate-800 pt-6"
      >
        <LogOut size={20} /> Đăng xuất
      </button>
    </div>
  );
}
