export type VacationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Vacation {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  status: VacationStatus;
}
