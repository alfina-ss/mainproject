import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button, Paper, Tabs, Tab, Typography } from "@mui/material";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load captcha on mount and when tab changes
  useEffect(() => {
    loadCaptchaEnginge(6); // 6-character captcha
    setCaptchaInput("");
    setCaptchaError("");
  }, [tab]);

  const handleTabChange = (event, newValue) => {
    setError("");
    setTab(newValue);
  };

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

  const handleCaptchaChange = (e) => setCaptchaInput(e.target.value);

  const verifyCaptcha = () => {
    if (validateCaptcha(captchaInput) === true) {
      setCaptchaError("");
      return true;
    } else {
      setCaptchaError("Captcha does not match");
      loadCaptchaEnginge(6); // reload captcha
      setCaptchaInput("");
      return false;
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!verifyCaptcha()) return;

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", loginData);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate(data.user.role === "artist" ? "/dashboard" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!verifyCaptcha()) return;

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/signup", signupData);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate(data.user.role === "artist" ? "/dashboard" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper sx={{ p: 4, width: 400 }}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        {tab === 0 && (
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

              {/* Captcha */}
              <Box mt={2} mb={1}>
                <LoadCanvasTemplate />
              </Box>
              <TextField
                label="Enter Captcha"
                value={captchaInput}
                onChange={handleCaptchaChange}
                fullWidth
                margin="normal"
                required
              />
              {captchaError && <Typography color="error">{captchaError}</Typography>}

              {error && <Typography color="error" mt={1}>{error}</Typography>}
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
        )}

        {tab === 1 && (
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

              {/* Captcha */}
              <Box mt={2} mb={1}>
                <LoadCanvasTemplate />
              </Box>
              <TextField
                label="Enter Captcha"
                value={captchaInput}
                onChange={handleCaptchaChange}
                fullWidth
                margin="normal"
                required
              />
              {captchaError && <Typography color="error">{captchaError}</Typography>}

              {error && <Typography color="error" mt={1}>{error}</Typography>}
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
