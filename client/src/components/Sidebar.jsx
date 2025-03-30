import React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChatIcon from "@mui/icons-material/Chat";

const Sidebar = () => {
  return (
    <List>
      <ListItem button component={Link} to="/dashboard">
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button component={Link} to="/tasks">
        <ListItemIcon><TaskIcon /></ListItemIcon>
        <ListItemText primary="Tasks" />
      </ListItem>
      <ListItem button component={Link} to="/calendar">
        <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
        <ListItemText primary="Calendar" />
      </ListItem>
      <ListItem button component={Link} to="/chat">
        <ListItemIcon><ChatIcon /></ListItemIcon>
        <ListItemText primary="Chat" />
      </ListItem>
    </List>
  );
};

export default Sidebar;