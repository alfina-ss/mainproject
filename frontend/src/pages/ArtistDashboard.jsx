import React, { useState, useEffect } from "react";

import axios from "axios";
import {
  Box, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText,
  AppBar, Toolbar, Avatar, Grid, Card, CardContent, Table, TableBody,
  TableCell, TableHead, TableRow, Button, TextField
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import BrushIcon from "@mui/icons-material/Brush";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

export default function ArtistDashboard({ user }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [stats, setStats] = useState({ bookings: 0, revenue: 0, clients: 0 });
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const token = user?.token;
  const artistId = user?.user?._id;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!artistId) return;

    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/artist/${artistId}/stats`,
          config
        );
        setStats(data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    };

    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/bookings/artists-bookings/`,
          config
        );
        setAppointments(data.bookings || []);
      } catch (err) {
        console.error("Appointments fetch error:", err);
      }
    };

    const fetchAvailability = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/artist/${artistId}/availability`,
          config
        );
        setAvailability(data.availability || []);
      } catch (err) {
        console.error("Availability fetch error:", err);
      }
    };

    const fetchServices = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/artist-services`,
          config
        );
        setServices(data.services || []);
      } catch (err) {
        console.error("Services fetch error:", err);
      }
    };

    const deleteService = async (id) => {
      if (!window.confirm("Are you sure you want to delete this service?")) return;

      try {
        await axios.delete(`http://localhost:5000/api/artist-services/${id}`, config);
        setServices((prev) => prev.filter((service) => service._id !== id));
      } catch (err) {
        console.error("Delete service error:", err);
      }
    };


    // fetchStats();
    fetchAppointments();
    // fetchAvailability();
    fetchServices();
  }, [artistId]);

  const addAvailability = async () => {
    if (!selectedDate) {
      alert("Please select a date!");
      return;
    }

    // format date to yyyy-mm-dd
    const date = selectedDate.toISOString().split("T")[0];

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/artist-dates/`,
        { date }, // only sending date
        config
      );
      setAvailability(data.availability || []);
      setSelectedDate(null);
    } catch (err) {
      console.error("Add availability error:", err);
    }
  };

  const deleteAvailability = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/artist-dates/${id}`, config);
      setAppointments((prev) => prev.filter((slot) => slot._id !== id));
    } catch (err) {
      console.error("Delete availability error:", err);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: "flex" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", backgroundColor: "#f8f9f8" },
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
              <ListItem button key={idx} onClick={() => item.text === "Logout" ? handleLogout() : setActiveSection(item.text)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, backgroundColor: "#ddb3b3", color: "black" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Artist Dashboard</Typography>
              <Avatar alt="Artist" src="https://i.pravatar.cc/150?img=47" />
            </Toolbar>
          </AppBar>
          <Toolbar />

          {/* Dashboard Section */}
          {activeSection === "Dashboard" && (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <EventIcon sx={{ color: "#ddb3b3" }} />
                    <Box>
                      <Typography variant="h6">{stats.bookings}</Typography>
                      <Typography color="text.secondary">Bookings</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <MonetizationOnIcon sx={{ color: "#8cbe18" }} />
                    <Box>
                      <Typography variant="h6">₹{stats.revenue}</Typography>
                      <Typography color="text.secondary">Revenue</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PeopleIcon sx={{ color: "#8cbe18" }} />
                    <Box>
                      <Typography variant="h6">{stats.clients}</Typography>
                      <Typography color="text.secondary">Clients</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Appointments Section */}
          {activeSection === "Appointments" && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Appointments</Typography>
              <Table sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 2 }}>
                <TableHead sx={{ backgroundColor: "#f0f3e8" }}>
                  <TableRow>
                    <TableCell>Client</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Date</TableCell>
                    {/* <TableCell>Time</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.length === 0 ? (
                    <TableRow><TableCell colSpan={4}>No appointments yet</TableCell></TableRow>
                  ) : (
                    appointments.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.bookingUser?.name }</TableCell>
                        <TableCell>{row.service?.name}</TableCell>
                        <TableCell>{new Date(row.date).toDateString()}</TableCell>
                        {/* <TableCell>{new Date(row.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</TableCell> */}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* Availability Section */}
          {activeSection === "Availability" && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Update Availability</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={10}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button variant="contained" fullWidth onClick={addAvailability}>Add</Button>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                {appointments.length === 0 ? (
                  <Typography color="gray">No availability added yet.</Typography>
                ) : (
                  <Table sx={{ boxShadow: 1 }}>
                    <TableHead sx={{ backgroundColor: "#f0f3e8" }}>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((slot, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{new Date(slot.date).toDateString()}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => deleteAvailability(slot._id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Box>
            </Box>
          )}


          {/* Services Section */}
          {activeSection === "Services" && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Artist Services</Typography>
              <Button
                size="small"
                color="primary"
                onClick={() => navigate("/artist/services")}
                sx={{ mr: 1 }}
              >Add service
              </Button>
              <Table sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 2 }}>
                <TableHead sx={{ backgroundColor: "#f0f3e8" }}>
                  <TableRow>
                    <TableCell>Service Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.length === 0 ? (
                    <TableRow><TableCell colSpan={3}>No services added</TableCell></TableRow>
                  ) : (

                    services.map((service, idx) => (

                      <TableRow key={idx}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>₹{service.price}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            color="primary"
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => deleteService(service._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          )}

        </Box>
      </Box>
    </LocalizationProvider>
  );
}
