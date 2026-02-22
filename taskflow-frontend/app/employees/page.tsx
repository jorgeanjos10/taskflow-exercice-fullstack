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
  TextField,
  Select,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TablePagination,
} from "@mui/material";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";
import { Link as MuiLink } from "@mui/material";
import Link from "next/link";

import { apiFetch } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Employee } from "@/types/employee";

export default function EmployeesPage() {
  const { userId, role } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("COLLABORATOR");
  const [editManagerId, setEditManagerId] = useState("");

  const [openCreate, setOpenCreate] = useState(false);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("COLLABORATOR");
  const [newManagerId, setNewManagerId] = useState("");

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 🔥 Pagination handlers
  const handleChangePage = (
    event: unknown,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  async function loadEmployees() {
    try {
      const data = await apiFetch("/employees", "GET", userId);
      setEmployees(data);
    } catch {
      alert("Error loading employees");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) loadEmployees();
  }, [userId]);

  async function handleCreate() {
    try {
      await apiFetch("/employees", "POST", userId, {
        name: newName,
        email: newEmail,
        role: newRole,
        managerId: newManagerId || null,
      });

      setOpenCreate(false);
      setNewName("");
      setNewEmail("");
      setNewManagerId("");
      setNewRole("COLLABORATOR");

      setToastMessage("Employee created successfully!");
      setToastOpen(true);

      setPage(0); // 🔥 reset page
      loadEmployees();
    } catch {
      alert("Error creating employee");
    }
  }

  function startEdit(emp: Employee) {
    setEditingId(emp.id);
    setEditName(emp.name);
    setEditEmail(emp.email);
    setEditRole(emp.role);
    setEditManagerId(emp.managerId ?? "");
  }

  async function handleUpdate(id: string) {
    try {
      await apiFetch(`/employees/${id}`, "PUT", userId, {
        name: editName,
        email: editEmail,
        role: editRole,
        managerId: editManagerId || null,
      });

      setEditingId(null);
      loadEmployees();
    } catch {
      alert("Error updating employee");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;

    try {
      await apiFetch(`/employees/${id}`, "DELETE", userId);
      setPage(0); // 🔥 reset page
      loadEmployees();
    } catch {
      alert("Error deleting employee");
    }
  }

  if (!userId) return <Typography>Select a user first</Typography>;
  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Stack spacing={4}>
      <Typography variant="h5" fontWeight="bold">
        Employees
      </Typography>

      {role === "ADMIN" && (
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create Employee
        </Button>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Manager</TableCell>
              {role === "ADMIN" && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {employees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((emp) => (
                <TableRow key={emp.id}>
                  {editingId === emp.id ? (
                    <>
                      <TableCell>
                        <TextField
                          size="small"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                        />
                      </TableCell>

                      <TableCell>
                        <Select
                          size="small"
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                        >
                          <MenuItem value="COLLABORATOR">
                            Collaborator
                          </MenuItem>
                          <MenuItem value="MANAGER">Manager</MenuItem>
                        </Select>
                      </TableCell>

                      <TableCell>
                        <Select
                          size="small"
                          value={editManagerId}
                          onChange={(e) =>
                            setEditManagerId(e.target.value)
                          }
                          displayEmpty
                        >
                          <MenuItem value="">No manager</MenuItem>
                          {employees
                            .filter((e) => e.role === "MANAGER")
                            .map((m) => (
                              <MenuItem key={m.id} value={m.id}>
                                {m.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Save />}
                            onClick={() => handleUpdate(emp.id)}
                          >
                            Save
                          </Button>

                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Cancel />}
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        <MuiLink
                          component={Link}
                          href={`/employees/${emp.id}`}
                          underline="hover"
                        >
                          {emp.name}
                        </MuiLink>
                      </TableCell>

                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.role}</TableCell>
                      <TableCell>{emp.managerName ?? "-"}</TableCell>

                      {role === "ADMIN" && (
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              startIcon={<Edit />}
                              onClick={() => startEdit(emp)}
                            >
                              Edit
                            </Button>

                            {emp.id !== userId && (
                              <Button
                                size="small"
                                color="error"
                                startIcon={<Delete />}
                                onClick={() =>
                                  handleDelete(emp.id)
                                }
                              >
                                Delete
                              </Button>
                            )}
                          </Stack>
                        </TableCell>
                      )}
                    </>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={employees.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Create Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth>
        <DialogTitle>Create Employee</DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            fullWidth
          />

          <Select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            fullWidth
          >
            <MenuItem value="COLLABORATOR">Collaborator</MenuItem>
            <MenuItem value="MANAGER">Manager</MenuItem>
          </Select>

          <Select
            value={newManagerId}
            onChange={(e) => setNewManagerId(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">No manager</MenuItem>
            {employees
              .filter((e) => e.role === "MANAGER")
              .map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))}
          </Select>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}