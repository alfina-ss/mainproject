import React, { useState, useEffect } from "react";
import {
    Box, Drawer, List, ListItem, ListItemIcon, ListItemText,
    AppBar, Toolbar, Typography, Avatar,
    Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper,
    Button,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const drawerWidth = 220;

export default function AdminPage() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("Users");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Admin authentication check
    useEffect(() => {
        const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
        if (!adminInfo || adminInfo.role !== "admin") {
            navigate("/admin/login"); // redirect if not admin
        }
    }, [navigate]);

    const token = JSON.parse(localStorage.getItem("adminInfo"))?.token; // use admin token
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/artists/all-users", config);
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [token]);

    // Accept user (approve request)
    const handleAccept = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/artists/approve/${id}`, {}, config);
            alert("User approved successfully");
            setUsers(users.map((u) =>
                u._id === id ? { ...u, status: "approved" } : u
            ));
        } catch (err) {
            console.error("Approve failed:", err);
            alert("Failed to approve user");
        }
    };

    // Delete (Reject) user
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to reject (delete) this user?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/artists/user-delete/${id}`, config);
            setUsers(users.filter((u) => u._id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete user");
        }
    };

    // Change role (if needed later)
    const handleRoleChange = async (id, newRole) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${id}/role`, { role: newRole }, config);
            setUsers(users.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
        } catch (err) {
            console.error("Role update failed:", err);
            alert("Failed to update role");
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("adminInfo"); // remove admin info
        navigate("/admin/login");
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", backgroundColor: "#f8f9f8" },
                }}
            >
                <Toolbar />
                <List>
                    <ListItem button onClick={() => setActiveSection("Users")}>
                        <ListItemIcon><PeopleIcon /></ListItemIcon>
                        <ListItemText primary="Users" />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <AppBar
                    position="fixed"
                    sx={{
                        width: `calc(100% - ${drawerWidth}px)`,
                        ml: `${drawerWidth}px`,
                    }}
                >
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h6">Admin Dashboard</Typography>
                        <Avatar alt="Admin" src="https://i.pravatar.cc/150?img=47" />
                    </Toolbar>
                </AppBar>
                <Toolbar />

                {activeSection === "Users" && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h5" gutterBottom>Users</Typography>
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: "#f0f3e8" }}>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5}>No users found</TableCell>
                                            </TableRow>
                                        ) : (
                                            users.map((user) => (
                                                <TableRow key={user._id}>
                                                    <TableCell>{user.name}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{user.role}</TableCell>
                                                    <TableCell>{user.status || "pending"}</TableCell>
                                                    <TableCell>
                                                        {user.status === "approved" ? (
                                                            <Typography color="green">Approved</Typography>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    variant="contained"
                                                                    color="success"
                                                                    sx={{ mr: 1 }}
                                                                    onClick={() => handleAccept(user._id)}
                                                                >
                                                                    Accept
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={() => handleDelete(user._id)}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
