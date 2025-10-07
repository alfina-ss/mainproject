import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    TextField,
    Button,
    Paper,
    Tabs,
    Tab,
    Typography,
} from "@mui/material";

export default function ArtistAuthPage() {
    const navigate = useNavigate();
    const [tab, setTab] = useState(0); // 0 = Login, 1 = SignUp
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: "",
        experience: "", // optional field
        skills: "",     // comma-separated skills
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTabChange = (e, newValue) => {
        setError("");
        setTab(newValue);
    };

    // ===== Login Handlers =====
    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/auth/login",
                loginData
            );

            if (data.user.role !== "artist") {
                setError("You are not registered as an artist.");
                setLoading(false);
                return;
            }

            localStorage.setItem("user", JSON.stringify(data));
            navigate("/dashboard"); // redirect to artist dashboard
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    // ===== Signup Handlers =====
    const handleSignupChange = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = {
                ...signupData,
                role: "artist",
                skills: signupData.skills.split(",").map((s) => s.trim()),
            };

            const { data } = await axios.post(
                "http://localhost:5000/api/auth/signup",
                payload
            );

            localStorage.setItem("user", JSON.stringify(data));
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
        >
            <Paper sx={{ p: 4, width: 400 }}>
                <Tabs value={tab} onChange={handleTabChange} centered>
                    {/* <Tab label="Login" /> */}
                    <Tab label="Sign Up" />
                </Tabs>

                {/* ===== Login Form ===== */}
                {/* {tab === 0 && (
                    <Box mt={2}>
                        <form onSubmit={handleLoginSubmit}>
                            <TextField
                                label="Email"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            {error && (
                                <Typography color="error" variant="body2" mt={1}>
                                    {error}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </Box>
                )} */}

                {/* ===== SignUp Form ===== */}
                {tab === 0 && (
                    <Box mt={2}>
                        <form onSubmit={handleSignupSubmit}>
                            <TextField
                                label="Name"
                                name="name"
                                value={signupData.name}
                                onChange={handleSignupChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={signupData.email}
                                onChange={handleSignupChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                value={signupData.password}
                                onChange={handleSignupChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                label="Experience (years)"
                                name="experience"
                                type="number"
                                value={signupData.experience}
                                onChange={handleSignupChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Skills (comma separated)"
                                name="skills"
                                value={signupData.skills}
                                onChange={handleSignupChange}
                                fullWidth
                                margin="normal"
                            />
                            {error && (
                                <Typography color="error" variant="body2" mt={1}>
                                    {error}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={loading}
                            >
                                {loading ? "Signing up..." : "Sign Up"}
                            </Button>
                        </form>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
