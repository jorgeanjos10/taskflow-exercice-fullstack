export type Role = "ADMIN" | "MANAGER" | "COLLABORATOR";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  managerId?: string;
  managerName?: string;
}
