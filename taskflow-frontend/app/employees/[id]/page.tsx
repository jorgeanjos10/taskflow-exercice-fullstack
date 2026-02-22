"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Typography, Paper, Stack } from "@mui/material";
import { apiFetch } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Employee } from "@/types/employee";
import { useBreadcrumb } from "@/context/BreadcrumbContext";

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const { userId } = useAuth();
  const { setDynamicLabel } = useBreadcrumb();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    async function loadEmployee() {
      try {
        const data = await apiFetch(`/employees/${id}`, "GET", userId);
        setEmployee(data);
      } catch {
        alert("Error loading employee");
      }
    }

    if (id && userId) {
      loadEmployee();
    }
  }, [id, userId]);

  useEffect(() => {
  if (employee) {
    setDynamicLabel(employee.name);
  }

  return () => {
    setDynamicLabel(null);
  };
}, [employee]);

  if (!employee) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight="bold">
          {employee.name}
        </Typography>

        <Typography>Email: {employee.email}</Typography>
        <Typography>Role: {employee.role}</Typography>
        <Typography>Manager: {employee.managerName ?? "None"}</Typography>
      </Stack>
    </Paper>
  );
}
