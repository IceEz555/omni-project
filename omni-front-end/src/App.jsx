import React, { useState } from "react";
import "./App.css";
import { Layout } from "./pages/layout";
import { AuthPage } from "./pages/auth";
import { Dashboard } from "./pages/dashboard";
import { LiveMonitor } from "./pages/liveMonitor";
import { Sessions } from "./pages/session";
import { SessionDetail } from "./pages/sessionDetail";

export default function App() {
  const [page, setPage] = useState("Login");

  if (page === "Login") return <AuthPage setPage={setPage} />;

  return (
    <Layout title={page} currentPage={page} setPage={setPage}>
      {page === "Dashboard" && <Dashboard setPage={setPage} />}
      {page === "Live Monitor" && <LiveMonitor />}
      {page === "Sessions" && <Sessions setPage={setPage} />}
      {page === "Session Detail" && <SessionDetail />}
    </Layout>
  );
}

