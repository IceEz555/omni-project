import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../css/auth.css";

export const RegisterPage = ({ setPage }) => {
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

    const handleRegister = () => {
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log("Registering with:", formData);
        // Simulate successful registration
        alert("Registration successful!");
        setPage("Login");
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <img src={logo} alt="Logo" className="auth-logo" />
                <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Register</h2>

                <div className="input-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="email@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>

                <button
                    className="btn-primary"
                    style={{
                        background: "var(--seafoam-main)",
                        color: "white",
                        border: "none",
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        fontSize: "16px",
                        cursor: "pointer",
                        marginTop: "10px"
                    }}
                    onClick={handleRegister}
                >
                    Register
                </button>

                <button
                    className="btn-link"
                    style={{
                        marginTop: "16px",
                        background: "transparent",
                        color: "var(--seafoam-main)",
                        border: "none",
                        width: "100%",
                        cursor: "pointer",
                        textDecoration: "underline"
                    }}
                    onClick={() => setPage("Login")}
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
};
