"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/services/api";

interface Employee {
  id: string;
  name: string;
  role: string;
}

export default function UserSelector() {
  const { userId, setUser } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const data = await apiFetch("/employees", "GET");

        data.sort((a: Employee, b: Employee) => {
          const roleOrder = {
            ADMIN: 1,
            MANAGER: 2,
            COLLABORATOR: 3,
          };

          return (
            roleOrder[a.role as keyof typeof roleOrder] -
            roleOrder[b.role as keyof typeof roleOrder]
          );
        });

        setEmployees(data);
      } catch (error) {
        console.error("Error loading employees", error);
      } finally {
        setLoading(false);
      }
    }

    loadEmployees();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="mb-4">
      <label className="mr-2 font-semibold">Acting as:</label>

      <select
        value={userId || ""}
        onChange={(e) => {
          const selected = employees.find((emp) => emp.id === e.target.value);

          if (selected) {
            setUser(selected.id, selected.role);
          }
        }}
        className="border p-2"
      >
        <option value="">Select user</option>

        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name} ({emp.role})
          </option>
        ))}
      </select>
    </div>
  );
}
