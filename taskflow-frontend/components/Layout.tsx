"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AppBreadcrumbs from "./AppBreadcrumbs";
import { BreadcrumbProvider } from "@/context/BreadcrumbContext";

const drawerWidth = 220;

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { role } = useAuth();

  const menuItems = [
    { label: "Employees", path: "/employees" },
    { label: "Vacations", path: "/vacations" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Bar */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1 }}
            onClick={() => router.push("/")}
            style={{ cursor: "pointer" }}
          >
            TaskFlow
          </Typography>
          <Typography variant="body2">{role}</Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            mt: 8,
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8,
        }}
      >
        <BreadcrumbProvider>
          <AppBreadcrumbs />
          {children}
        </BreadcrumbProvider>
      </Box>
    </Box>
  );
}
