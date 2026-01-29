import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/logo.png";
import "../css/auth.css";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";

export const AuthPage = () => { // Removed setPage prop
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });
      console.log("Login Success:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Successful! 🚀");

      // Role-based redirection
      const role = response.data.user.role?.toLowerCase();

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "supporter") {
        navigate("/support/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Login Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="Logo" className="auth-logo" />
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <Input
              label="Email"
              type="text"
              placeholder="admin@omni.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <Input
              label="Password"
              type="password"
              placeholder="password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="btn-primary"
            type="submit"
            style={{ width: '100%', marginTop: '16px' }}
          >
            Sign In
          </Button>
        </form>

        <Button
          variant="outline"
          className="btn-link"
          onClick={() => navigate("/register")}
          style={{ width: '100%', marginTop: '12px', border: 'none', background: 'transparent' }}
        >
          Create an Account
        </Button>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <Button
            className="btn-secondary"
            onClick={() => navigate("/admin/dashboard")}
            style={{ flex: 1, fontSize: '12px' }}
          >
            Login as Admin
          </Button>
          <Button
            className="btn-secondary"
            onClick={() => navigate("/support/dashboard")}
            style={{ flex: 1, fontSize: '12px' }}
          >
            Login as Supporter
          </Button>
        </div>
      </div>
    </div>
  );
};
