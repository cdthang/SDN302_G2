import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import CharityManagement from "./CharityManagement";
import PostManagement from "./PostManagement";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("charity");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Giao diện Sidebar đã được tách riêng */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "charity" ? (
          <CharityManagement />
        ) : (
          <PostManagement />
        )}
      </main>
    </div>
  );
}
