import React from "react";
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { ProjectDetails } from "./pages/projectDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="profiles" element={<DeviceProfile />} />
        <Route path="inventory" element={<DeviceInventory />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* Support Routes */}
      <Route path="/support" element={<LayoutSupport />}>
        <Route index element={<Navigate to="/support/dashboard" replace />} />
        <Route path="dashboard" element={<SupportDashboard />} />
        <Route path="labeling" element={<DataLabeling />} />
        <Route path="training" element={<ModelTraining />} />
        <Route path="evaluation" element={<ModelEvaluation />} />
      </Route>

      {/* User Routes (LayoutUser acts as wrapper) */}
      <Route path="/" element={<LayoutUser />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="project/:id" element={<ProjectDetails />} />
        <Route path="live-monitor" element={<LiveMonitor />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="sessions/:id" element={<SessionDetail />} />
      </Route>
    </Routes>
  );
}

