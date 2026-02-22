package com.taskflow.repository;

import com.taskflow.entity.Employee;
import com.taskflow.entity.VacationRequest;
import com.taskflow.enums.VacationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface VacationRequestRepository extends JpaRepository<VacationRequest, UUID> {

    boolean existsByEmployeeAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Employee employee,
            List<VacationStatus> status,
            LocalDate endDate,
            LocalDate startDate
    );

    List<VacationRequest> findByEmployeeId(UUID employeeId);

    List<VacationRequest> findByEmployeeManagerIdOrEmployeeId(UUID managerId, UUID employeeId);
}


