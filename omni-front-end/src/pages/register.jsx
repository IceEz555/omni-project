import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/logo.png";
import "../css/auth.css";
import "../css/register.css";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";

export const RegisterPage = () => { // Removed setPage prop
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async () => {
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await api.post("/auth/register", {
                email: formData.email,
                username: formData.username,
                password: formData.password
            });
            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <img src={logo} alt="Logo" className="auth-logo" />
                <h2 className="register-title">Register</h2>

                <div className="input-group">
                    <Input
                        label="Username"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="email@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>

                <Button
                    className="btn-primary"
                    onClick={handleRegister}
                    style={{ width: '100%', marginTop: '16px' }}
                >
                    Register
                </Button>

                <Button
                    variant="outline"
                    className="btn-link btn-back-login"
                    onClick={() => navigate("/login")}
                    style={{ width: '100%', marginTop: '12px', border: 'none', background: 'transparent' }}
                >
                    Back to Login
                </Button>
            </div>
        </div>
    );
};
