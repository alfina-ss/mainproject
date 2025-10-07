import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import Avatar from "@mui/material/Avatar";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha("#150d0aff", 0.15),
  "&:hover": {
    backgroundColor: alpha("#150d0aff", 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(0.5, 1, 0.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [search, setSearch] = useState("");

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const guestLinks = ["Home", "About", "Services", "Contact"];
  let authLinks = ["Home", "About", "Services", "Contact", "My Bookings"];

  // ✅ Only artists see dashboard
  if (user?.role === "artist") {
    authLinks.push("Dashboard");
  }

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      setUser(null);
      navigate("/");
    }
  };

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(search)}`);
      setSearch("");
      handleMobileMenuClose();
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* ✅ Show artist avatar + name in mobile menu */}
      {user?.role === "artist" && (
        <MenuItem disabled>
          <Avatar
            alt={user.name}
            src={user.avatar || ""}
            sx={{
              bgcolor: "#8cbe18",
              width: 28,
              height: 28,
              fontSize: "12px",
              mr: 1,
            }}
          >
            {user.name?.[0] || "A"}
          </Avatar>
          {user.name}
        </MenuItem>
      )}

      {(user ? authLinks : guestLinks).map((text, i) => {
        const path =
          text === "Home"
            ? "/"
            : text === "Dashboard"
              ? "/dashboard"
              : `/${text.toLowerCase()}`;
        return (
          <MenuItem key={i} onClick={handleMobileMenuClose}>
            <Link
              to={path}
              style={{ textDecoration: "none", color: "#150d0aff" }}
            >
              {text}
            </Link>
          </MenuItem>
        );
      })}
      {!user && (
        <MenuItem onClick={handleMobileMenuClose}>
          <Link
            to="/login"
            style={{ textDecoration: "none", color: "#150d0aff" }}
          >
            Login
          </Link>
        </MenuItem>
      )}
      {user && (
        <MenuItem
          onClick={() => {
            handleLogout();
            handleMobileMenuClose();
          }}
        >
          Logout
        </MenuItem>
      )}
      <MenuItem>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </Search>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#ddb3b3", color: "#150d0aff" }}
    >
      <Toolbar>
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Glamora Logo"
          style={{ width: 120, height: "auto", cursor: "pointer" }}
          onClick={() => navigate("/")}
        />

        {/* Desktop links */}
        <div
          style={{ flexGrow: 1, display: "flex", gap: "1rem", marginLeft: 20 }}
        >
          {(user ? authLinks : guestLinks).map((text, i) => {
            const path =
              text === "Home"
                ? "/"
                : text === "Dashboard"
                  ? "/dashboard"
                  : `/${text.toLowerCase()}`;
            return (
              <Button
                key={i}
                color="inherit"
                component={Link}
                to={path}
                sx={{ textTransform: "none" }}
              >
                {text}
              </Button>
            );
          })}
        </div>

        {/* Search bar desktop */}
        <Search sx={{ display: { xs: "none", sm: "flex" } }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </Search>

        {/* ✅ Right side auth section */}
        {!user ? (
          <Button
            color="inherit"
            component={Link}
            to="/login"
            startIcon={<LoginIcon />}
            sx={{
              marginLeft: 2,
              fontWeight: "bold",
              fontSize: "14px",
              textTransform: "none",
              color: "#150d0aff",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Login
          </Button>
        ) : user.role === "artist" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginLeft: "1rem",
            }}
          >
            <Avatar
              alt={user.name}
              src={user.avatar || ""}
              sx={{
                bgcolor: "#8cbe18",
                width: 32,
                height: 32,
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/dashboard")} // ✅ Click avatar to go to dashboard
            >
              {user.name?.[0] || "A"}
            </Avatar>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#150d0aff" }}
            >
              {user.name}
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                fontWeight: "bold",
                fontSize: "14px",
                textTransform: "none",
                color: "#150d0aff",
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          // Normal customer logout
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              marginLeft: 2,
              fontWeight: "bold",
              fontSize: "14px",
              textTransform: "none",
              color: "#150d0aff",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Logout
          </Button>
        )}

        {/* Mobile menu icon */}
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="menu"
          sx={{ display: { sm: "none" } }}
          onClick={handleMobileMenuOpen}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {renderMobileMenu}
    </AppBar>
  );
}
