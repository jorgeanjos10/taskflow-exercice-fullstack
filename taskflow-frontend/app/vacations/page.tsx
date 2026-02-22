"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TablePagination,
} from "@mui/material";

import { apiFetch } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface Vacation {
  id: string;
  employee: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  startDate: string;
  endDate: string;
  status: string;
}

export default function VacationsPage() {
  const { userId, role } = useAuth();

  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function showSnackbar(message: string, severity: "success" | "error") {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  }

  async function loadVacations() {
    try {
      const data = await apiFetch("/vacations", "GET", userId);
      setVacations(data);
    } catch {
      showSnackbar("Error loading vacations", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!startDate || !endDate) {
      showSnackbar("Select start and end dates", "error");
      return;
    }

    if (endDate.isBefore(startDate)) {
      showSnackbar("End date cannot be before start date", "error");
      return;
    }

    try {
      await apiFetch("/vacations", "POST", userId, {
        employeeId: userId,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      });

      setOpenCreate(false);
      setStartDate(null);
      setEndDate(null);

      showSnackbar("Vacation request created!", "success");

      loadVacations();
    } catch (error: any) {
      showSnackbar(error?.message || "Error creating vacation", "error");
    }
  }

  async function handleApprove(id: string) {
    try {
      await apiFetch(`/vacations/${id}/approve`, "PUT", userId);

      showSnackbar("Vacation approved successfully", "success");

      loadVacations();
    } catch (error: any) {
      showSnackbar(error?.message || "Error approving vacation", "error");
    }
  }

  async function handleReject(id: string) {
    try {
      await apiFetch(`/vacations/${id}/reject`, "PUT", userId);

      showSnackbar("Vacation rejected successfully", "success");

      loadVacations();
    } catch (error: any) {
      showSnackbar(error?.message || "Error rejecting vacation", "error");
    }
  }

  async function handleCancel(id: string) {
    try {
      await apiFetch(`/vacations/${id}/cancel`, "PUT", userId);

      showSnackbar("Vacation cancelled successfully", "success");

      loadVacations();
    } catch (error: any) {
      showSnackbar(error?.message || "Error cancelling vacation", "error");
    }
  }

  useEffect(() => {
    if (userId) loadVacations();
  }, [userId]);

  if (!userId) return <Typography>Select a user first</Typography>;

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Stack spacing={4}>
      <Typography variant="h5" fontWeight="bold">
        Vacation Requests
      </Typography>

      <TableContainer component={Paper}>
        {role === "COLLABORATOR" && (
          <Button
            sx={{ m: 2 }}
            variant="contained"
            onClick={() => setOpenCreate(true)}
          >
            Request Vacation
          </Button>
        )}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Status</TableCell>
              {(role === "MANAGER" || role === "ADMIN") && (
                <TableCell>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {vacations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((vac) => (
                <TableRow key={vac.id}>
                  <TableCell>{vac.employee.name}</TableCell>

                  <TableCell>
                    {dayjs(vac.startDate).format("DD-MM-YYYY")}
                  </TableCell>

                  <TableCell>
                    {dayjs(vac.endDate).format("DD-MM-YYYY")}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={vac.status}
                      color={
                        vac.status === "APPROVED"
                          ? "success"
                          : vac.status === "REJECTED"
                            ? "error"
                            : "warning"
                      }
                    />
                  </TableCell>

                  {vac.status === "PENDING" && (
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {(role === "MANAGER" || role === "ADMIN") && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleApprove(vac.id)}
                            >
                              Approve
                            </Button>

                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() => handleReject(vac.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {role === "COLLABORATOR" &&
                          vac.employee.id === userId && (
                            <Button
                              size="small"
                              color="warning"
                              variant="outlined"
                              onClick={() => handleCancel(vac.id)}
                            >
                              Cancel
                            </Button>
                          )}
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={vacations.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />

        <Dialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          fullWidth
        >
          <DialogTitle>Request Vacation</DialogTitle>

          <DialogContent sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={3}>
                <DatePicker
                  disablePast
                  label="Start Date"
                  format="DD/MM/YYYY"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                />

                <DatePicker
                  disablePast
                  label="End Date"
                  format="DD/MM/YYYY"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                />
              </Stack>
            </LocalizationProvider>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreate}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
