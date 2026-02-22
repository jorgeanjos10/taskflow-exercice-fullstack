package com.taskflow.service;

import com.taskflow.entity.Employee;
import com.taskflow.enums.Role;
import com.taskflow.exception.BusinessException;
import com.taskflow.exception.NotFoundException;
import com.taskflow.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // =========================
    // CREATE
    // =========================
    public Employee create(String name,
                           String email,
                           Role role,
                           UUID managerId,
                           UUID loggedEmployeeId) {

        Employee loggedEmployee = employeeRepository.findById(loggedEmployeeId)
                .orElseThrow(() -> new NotFoundException("Employee not found"));

        if (loggedEmployee.getRole() != Role.ADMIN) {
            throw new BusinessException("Only admins can create employees");
        }

        Employee manager = null;

        if (managerId != null) {
            manager = employeeRepository.findById(managerId)
                    .orElseThrow(() -> new NotFoundException("Manager not found"));
        }

        Employee employee = new Employee();
        employee.setId(UUID.randomUUID());
        employee.setName(name);
        employee.setEmail(email);
        employee.setRole(role);
        employee.setManager(manager);

        return employeeRepository.save(employee);
    }

    // =========================
    // UPDATE
    // =========================
    public Employee update(UUID id,
                           String name,
                           String email,
                           Role role,
                           UUID managerId,
                           UUID loggedEmployeeId) {

        Employee loggedEmployee = employeeRepository.findById(loggedEmployeeId)
                .orElseThrow(() -> new NotFoundException("Employee not found"));

        if (loggedEmployee.getRole() != Role.ADMIN) {
            throw new BusinessException("Only admins can update employees");
        }

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Employee not found"));

        Employee manager = null;

        if (managerId != null) {
            manager = employeeRepository.findById(managerId)
                    .orElseThrow(() -> new NotFoundException("Manager not found"));
        }

        employee.setName(name);
        employee.setEmail(email);
        employee.setRole(role);
        employee.setManager(manager);

        return employeeRepository.save(employee);
    }

    // =========================
    // DELETE
    // =========================
    public void delete(UUID id, UUID loggedEmployeeId) {

        Employee loggedEmployee = employeeRepository.findById(loggedEmployeeId)
                .orElseThrow(() -> new NotFoundException("Employee not found"));

        if (loggedEmployee.getRole() != Role.ADMIN) {
            throw new BusinessException("Only admins can delete employees");
        }

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Employee not found"));

        employeeRepository.delete(employee);
    }

    // =========================
    // FIND ALL
    // =========================
    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    // =========================
    // FIND BY ID
    // =========================
    public Employee findById(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Employee not found"));
    }
}
