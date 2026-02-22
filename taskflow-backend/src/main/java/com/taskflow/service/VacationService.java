package com.taskflow.service;

import com.taskflow.entity.Employee;
import com.taskflow.entity.VacationRequest;
import com.taskflow.enums.Role;
import com.taskflow.enums.VacationStatus;
import com.taskflow.exception.BusinessException;
import com.taskflow.exception.NotFoundException;
import com.taskflow.repository.EmployeeRepository;
import com.taskflow.repository.VacationRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class VacationService {

    private final VacationRequestRepository vacationRepository;
    private final EmployeeRepository employeeRepository;

    public VacationService(VacationRequestRepository vacationRepository,
                           EmployeeRepository employeeRepository) {
        this.vacationRepository = vacationRepository;
        this.employeeRepository = employeeRepository;
    }

    // =========================
    // CREATE VACATION
    // =========================
    public VacationRequest create(UUID employeeId,
                                  LocalDate start,
                                  LocalDate end,
                                  UUID loggedEmployeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new NotFoundException("Employee not found"));

        Employee loggedEmployee = employeeRepository.findById(loggedEmployeeId)
                .orElseThrow(() -> new NotFoundException("Logged employee not found"));

        // 🔒 Colaborador só pode criar as suas próprias férias
        if (loggedEmployee.getRole() == Role.COLLABORATOR &&
                !employee.getId().equals(loggedEmployee.getId())) {
            throw new BusinessException("You can only create your own vacation requests");
        }

        if (start.isAfter(end)) {
            throw new BusinessException("Start date cannot be after end date");
        }

        // 🔎 Verificar sobreposição
        boolean overlapExists =
                vacationRepository.existsByEmployeeAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        employee,
                        List.of(VacationStatus.APPROVED, VacationStatus.PENDING),
                        end,
                        start
                );

        if (overlapExists) {
            throw new BusinessException("Vacation dates overlap with another request");
        }

        VacationRequest vacation = new VacationRequest();
        vacation.setId(UUID.randomUUID());
        vacation.setEmployee(employee);
        vacation.setStartDate(start);
        vacation.setEndDate(end);
        vacation.setStatus(VacationStatus.PENDING);
        vacation.setCreatedAt(LocalDateTime.now());

        return vacationRepository.save(vacation);
    }

    // =========================
    // APPROVE VACATION
    // =========================
    public VacationRequest approve(UUID vacationId, UUID loggedEmployeeId) {

        VacationRequest vacation = vacationRepository.findById(vacationId)
                .orElseThrow(() -> new NotFoundException("Vacation not found"));

        Employee loggedEmployee = employeeRepository.findById(loggedEmployeeId)
                .orElseThrow(() -> new NotFoundException("Employee not found"));

        validateApprovalPermission(vacation, loggedEmployee);

        vacation.setStatus(VacationStatus.APPROVED);

        return vacationRepository.save(vacation);
    }

    // =========================
    // REJECT VACATION
    // =========================
    public VacationRequest reject(UUID vacationId, UUID loggedEmployeeId) {

        VacationRequest vacation = vacationRepository.findById(vacationId)
                .orElseThrow(() -> new NotFoundException("Vacation not found"));

        Employee loggedEmployee = employeeRepository.findById(loggedEmployeeId)
                .orElseThrow(() -> new NotFoundException("Employee not found"));

        validateApprovalPermission(vacation, loggedEmployee);

        vacation.setStatus(VacationStatus.REJECTED);

        return vacationRepository.save(vacation);
    }
    
    public List<VacationRequest> getAll(UUID loggedUserId) {

        Employee loggedEmployee = employeeRepository.findById(loggedUserId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Role role = loggedEmployee.getRole();

        // 👑 ADMIN vê tudo
        if (role == Role.ADMIN) {
            return vacationRepository.findAll();
        }

        // 👔 MANAGER vê:
        // - as próprias férias
        // - as férias dos seus colaboradores
        if (role == Role.MANAGER) {
            return vacationRepository
                    .findByEmployeeManagerIdOrEmployeeId(
                            loggedUserId,
                            loggedUserId
                    );
        }

        // 👤 COLLABORATOR vê apenas as próprias
        if (role == Role.COLLABORATOR) {
            return vacationRepository.findByEmployeeId(loggedUserId);
        }

        throw new BusinessException("Invalid role");
    }


    // =========================
    // PERMISSION VALIDATION
    // =========================
    private void validateApprovalPermission(VacationRequest vacation,
                                            Employee loggedEmployee) {

        // ADMIN pode tudo
        if (loggedEmployee.getRole() == Role.ADMIN) {
            return;
        }

        // MANAGER pode aprovar apenas da sua equipa
        if (loggedEmployee.getRole() == Role.MANAGER) {

            Employee vacationEmployee = vacation.getEmployee();

            // Manager não pode aprovar as próprias férias
            if (vacationEmployee.getId().equals(loggedEmployee.getId())) {
                throw new BusinessException("Manager cannot approve their own vacation");
            }

            // Só pode aprovar se for manager direto
            if (vacationEmployee.getManager() == null ||
                !vacationEmployee.getManager().getId()
                        .equals(loggedEmployee.getId())) {
                throw new BusinessException("You can only approve vacations of your team");
            }

            return;
        }

        // COLLABORATOR nunca pode aprovar
        throw new BusinessException("You are not allowed to approve vacations");
    }
    
 // =========================
 // UPDATE VACATION
 // =========================
 public VacationRequest update(UUID vacationId,
                               LocalDate newStart,
                               LocalDate newEnd,
                               UUID loggedEmployeeId) {

     VacationRequest vacation = vacationRepository.findById(vacationId)
             .orElseThrow(() -> new NotFoundException("Vacation not found"));

     Employee loggedEmployee = employeeRepository.findById(loggedEmployeeId)
             .orElseThrow(() -> new NotFoundException("Employee not found"));

     // 🔒 Se já estiver aprovada, não pode editar
     if (vacation.getStatus() == VacationStatus.APPROVED) {
         throw new BusinessException("Approved vacations cannot be edited");
     }

     // 👤 Collaborator só pode editar as próprias
     if (loggedEmployee.getRole() == Role.COLLABORATOR &&
             !vacation.getEmployee().getId().equals(loggedEmployee.getId())) {
         throw new BusinessException("You can only edit your own vacations");
     }

     // 👨‍💼 Manager não pode editar (apenas aprovar/rejeitar)
     if (loggedEmployee.getRole() == Role.MANAGER) {
         throw new BusinessException("Managers cannot edit vacations");
     }

     if (newStart.isAfter(newEnd)) {
         throw new BusinessException("Start date cannot be after end date");
     }

     // 🔎 Verificar sobreposição (ignorando a própria vacation)
     boolean overlapExists =
             vacationRepository.existsByEmployeeAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                     vacation.getEmployee(),
                     List.of(VacationStatus.APPROVED, VacationStatus.PENDING),
                     newEnd,
                     newStart
             );

     if (overlapExists) {
         throw new BusinessException("Vacation dates overlap with another request");
     }

     vacation.setStartDate(newStart);
     vacation.setEndDate(newEnd);

     return vacationRepository.save(vacation);
 }

//=========================
//DELETE VACATION
//=========================
public void delete(UUID vacationId, UUID loggedEmployeeId) {

  VacationRequest vacation = vacationRepository.findById(vacationId)
          .orElseThrow(() -> new NotFoundException("Vacation not found"));

  Employee loggedEmployee = employeeRepository.findById(loggedEmployeeId)
          .orElseThrow(() -> new NotFoundException("Employee not found"));

  // 👤 Collaborator
  if (loggedEmployee.getRole() == Role.COLLABORATOR) {

      if (!vacation.getEmployee().getId().equals(loggedEmployee.getId())) {
          throw new BusinessException("You can only delete your own vacations");
      }

      if (vacation.getStatus() != VacationStatus.PENDING) {
          throw new BusinessException("Only pending vacations can be deleted");
      }
  }

  // 👨‍💼 Manager
  if (loggedEmployee.getRole() == Role.MANAGER) {
      throw new BusinessException("Managers cannot delete vacations");
  }

  // 👑 Admin pode tudo

  vacationRepository.delete(vacation);
}


//=========================
//CANCEL VACATION
//=========================
public VacationRequest cancel(UUID vacationId, UUID userId) {

    VacationRequest vacation = vacationRepository.findById(vacationId)
            .orElseThrow(() -> new BusinessException("Vacation not found"));

    // must be the owner
    if (!vacation.getEmployee().getId().equals(userId)) {
        throw new BusinessException("You can only cancel your own vacations");
    }

    // must be PENDING
    if (!vacation.getStatus().equals(VacationStatus.PENDING)) {
        throw new BusinessException("Only pending vacations can be cancelled");
    }

    vacation.setStatus(VacationStatus.REJECTED);

    return vacationRepository.save(vacation);
}

 
}
