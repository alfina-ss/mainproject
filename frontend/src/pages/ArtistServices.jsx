import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    Avatar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import BrushIcon from "@mui/icons-material/Brush";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

export default function ArtistServices({ user }) {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [serviceName, setServiceName] = useState("");
    const [price, setPrice] = useState("");


    
    const token = user?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Fetch services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:5000/api/artist-services",
                    config
                );
                setServices(data || []);
            } catch (err) {
                console.error("Fetch services error:", err);
            }
        };

        fetchServices();
    }, []);

    // Add service
    const addService = async () => {
        if (!serviceName || !price) {
            alert("Please enter service name and price!");
            return;
        }

        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/artist-services",
                { name: serviceName, price },
                config
            );
            setServices((prev) => [...prev, data]);
            setServiceName("");
            setPrice("");
        } catch (err) {
            console.error("Add service error:", err);
        }
    };

    // Delete service
    const deleteService = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/artist-services/${id}`, config);
            setServices((prev) => prev.filter((s) => s._id !== id));
        } catch (err) {
            console.error("Delete service error:", err);
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/* Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#f8f9f8",
                    },
                }}
            >
                <Toolbar />
                <List>
                    {[
                        { text: "Dashboard", icon: <DashboardIcon /> },
                        { text: "Appointments", icon: <EventIcon /> },
                        { text: "Services", icon: <BrushIcon /> },
                        { text: "Availability", icon: <MonetizationOnIcon /> },
                        { text: "Logout", icon: <LogoutIcon /> },
                    ].map((item, idx) => (
                        <ListItem
                            button
                            key={idx}
                            onClick={() =>
                                item.text === "Logout" ? handleLogout() : navigate(`/artist/${item.text.toLowerCase()}`)
                            }
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* AppBar */}
                <AppBar
                    position="fixed"
                    sx={{
                        width: `calc(100% - ${drawerWidth}px)`,
                        ml: `${drawerWidth}px`,
                        backgroundColor: "#ddb3b3",
                        color: "black",
                    }}
                >
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h6">Artist Dashboard</Typography>
                        <Avatar alt="Artist" src="https://i.pravatar.cc/150?img=47" />
                    </Toolbar>
                </AppBar>
                <Toolbar />

                {/* Page Content */}
                <Box sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Manage Services
                    </Typography>

                    {/* Add Service Form */}
                    <Paper sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Add New Service
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                label="Service Name"
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                fullWidth
                            />
                            <Button variant="contained" onClick={addService}>
                                Add
                            </Button>
                        </Box>
                    </Paper>

                    {/* Services List */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Existing Services
                        </Typography>
                        <Table>
                            <TableHead sx={{ backgroundColor: "#f0f3e8" }}>
                                <TableRow>
                                    <TableCell>Service Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {services.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3}>No services added</TableCell>
                                    </TableRow>
                                ) : (
                                    services.map((s) => (
                                        <TableRow key={s._id}>
                                            <TableCell>{s.name}</TableCell>
                                            <TableCell>₹{s.price}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => deleteService(s._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}
