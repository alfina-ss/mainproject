import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Services from "./pages/Services";
import Booking from "./pages/booking";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ArtistProfile from "./pages/ArtistProfile";
import ArtistDashboard from "./pages/ArtistDashboard";
import Home from "./pages/Home"; // normal user homepage
import ArtistSignup from "./pages/ArtistSignup"; // new artist signup page
import ArtistServices from "./pages/ArtistServices";
import MyBookings from "./pages/MyBookings";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";


// PrivateRoute component
function PrivateRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;
  if (role && user.user.role !== role) return <Navigate to="/" />;
  return children;
}

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/admin-login" />; // not logged in
  if (user.user.role !== "admin") return <Navigate to="/" />; // not admin
  return children;
}


// Wrapper to get location inside Router
function AppWrapper() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Load user from localStorage on page load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Hide Navbar/Footer on login, dashboard, and artist signup pages
  const hideNavbarFooter = ["/login", "/dashboard", "/artist-signup", "/artist/services", "/admin"].includes(location.pathname);

  return (
    <>
      {!hideNavbarFooter && <Navbar user={user} setUser={setUser} />}
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing user={user} setUser={setUser} />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking/:artistId" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/artist/:id" element={<ArtistProfile />} />
        <Route path="/artist/services" element={<ArtistServices user={user} />} />
        <Route path="/my bookings" element={<MyBookings />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminPage />} />


        {/* Login page */}
        <Route
          path="/login"
          element={
            !user ? (
              <Login setUser={setUser} />
            ) : user.user.role === "artist" ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Artist signup page */}
        <Route path="/artist-signup" element={<ArtistSignup setUser={setUser} />} />

        {/* Artist dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="artist">
              <ArtistDashboard user={user} />
            </PrivateRoute>
          }
        />

        {/* Normal user homepage */}
        <Route
          path="/home"
          element={
            <PrivateRoute role="user">
              <Home user={user} />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
