import React, { useState } from "react";
import "./App.css";
import { LayoutUser } from "./layout/layoutUser";
import { LayoutSupport } from "./layout/layoutSupport";
import { AdminLayout } from "./layout/layoutAdmin";
import { AuthPage } from "./pages/auth";
import { RegisterPage } from "./pages/register";
import { Dashboard } from "./pages/dashboard";
import { LiveMonitor } from "./pages/liveMonitor";
import { Sessions } from "./pages/session";
import { SessionDetail } from "./pages/sessionDetail";
import { AdminDashboard } from "./admin/adminDashboard";
import { UserManagement } from "./admin/userManagement";
import { DeviceProfile } from "./admin/deviceProfile";
import { DeviceInventory } from "./admin/deviceInventory";
import { SupportDashboard } from "./support/supportDashboard";
import { DataLabeling } from "./support/dataLabeling";
import { ModelTraining } from "./support/modelTraining";
import { ModelEvaluation } from "./support/modelEvaluation";

export default function App() {
  const [page, setPage] = useState("Login");

  if (page === "Login") return <AuthPage setPage={setPage} />;
  if (page === "Register") return <RegisterPage setPage={setPage} />;

  const adminPages = ["AdminDashboard", "Device Profile", "Device Inventory", "User Management"];
  const isAdminPage = adminPages.includes(page);

  const supportPages = ["Support Dashboard", "Data Labeling", "Model Training", "Model Evaluation"];
  const isSupportPage = supportPages.includes(page);

  if (isAdminPage) {
    return (
      <AdminLayout title={page} currentPage={page} setPage={setPage}>
        {page === "AdminDashboard" && <AdminDashboard />}
        {page === "Device Profile" && <DeviceProfile />}
        {page === "Device Inventory" && <DeviceInventory />}
        {page === "User Management" && <UserManagement />}
      </AdminLayout>
    );
  }

  if (isSupportPage) {
    return (
      <LayoutSupport title={page} currentPage={page} setPage={setPage}>
        {page === "Support Dashboard" && <SupportDashboard />}
        {page === "Data Labeling" && <DataLabeling />}
        {page === "Model Training" && <ModelTraining />}
        {page === "Model Evaluation" && <ModelEvaluation />}
      </LayoutSupport>
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

