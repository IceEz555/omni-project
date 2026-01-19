import React, { useState } from "react";
import "./App.css";
import { LayoutUser } from "./layout/layoutUser";
import { AdminLayout } from "./layout/layoutAdmin";
import { DeviceProfile } from "./pages/deviceProfile";
import { UserManagement } from "./pages/userManagement";
import { AuthPage } from "./pages/auth";
import { Dashboard } from "./pages/dashboard";
import { LiveMonitor } from "./pages/liveMonitor";
import { Sessions } from "./pages/session";
import { SessionDetail } from "./pages/sessionDetail";
import { AdminDashboard } from "./pages/adminDashboard";

export default function App() {
  const [page, setPage] = useState("Login");

  if (page === "Login") return <AuthPage setPage={setPage} />;

  const adminPages = ["AdminDashboard", "Device Profile", "User Management"];
  const isAdminPage = adminPages.includes(page);

  if (isAdminPage) {
    return (
      <AdminLayout title={page} currentPage={page} setPage={setPage}>
        {page === "AdminDashboard" && <AdminDashboard />}
        {page === "Device Profile" && <DeviceProfile />}
        {page === "User Management" && <UserManagement />}
      </AdminLayout>
    );
  }

  return (
    <LayoutUser title={page} currentPage={page} setPage={setPage}>
      {page === "Dashboard" && <Dashboard setPage={setPage} />}
      {page === "Live Monitor" && <LiveMonitor />}
      {page === "Sessions" && <Sessions setPage={setPage} />}
      {page === "Session Detail" && <SessionDetail />}
    </LayoutUser>
  );
}

