package com.taskflow.controller;

import com.taskflow.dto.CreateEmployeeDTO;
import com.taskflow.dto.EmployeeResponseDTO;
import com.taskflow.entity.Employee;
import com.taskflow.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // =========================
    // CREATE EMPLOYEE
    // =========================
    @PostMapping
    public ResponseEntity<EmployeeResponseDTO> create(
            @RequestBody CreateEmployeeDTO dto,
            @RequestHeader("X-USER-ID") UUID userId) {

        Employee employee = employeeService.create(
                dto.getName(),
                dto.getEmail(),
                dto.getRole(),
                dto.getManagerId(),
                userId
        );

        return ResponseEntity.ok(toResponseDTO(employee));
    }


    // =========================
    // GET ALL EMPLOYEES
    // =========================
    @GetMapping
    public ResponseEntity<List<EmployeeResponseDTO>> findAll() {

        List<EmployeeResponseDTO> response =
                employeeService.findAll()
                        .stream()
                        .map(this::toResponseDTO)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // =========================
    // GET EMPLOYEE BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> findById(
            @PathVariable UUID id) {

        Employee employee = employeeService.findById(id);

        return ResponseEntity.ok(toResponseDTO(employee));
    }

    // =========================
    // MAPPER
    // =========================
    private EmployeeResponseDTO toResponseDTO(Employee employee) {

        EmployeeResponseDTO dto = new EmployeeResponseDTO();

        dto.setId(employee.getId());
        dto.setName(employee.getName());
        dto.setEmail(employee.getEmail());
        dto.setRole(employee.getRole());

        if (employee.getManager() != null) {
            dto.setManagerId(employee.getManager().getId());
            dto.setManagerName(employee.getManager().getName());
        }

        return dto;
    }
    
 // =========================
    // UPDATE
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> update(
            @PathVariable UUID id,
            @RequestBody CreateEmployeeDTO dto,
            @RequestHeader("X-USER-ID") UUID userId) {

        Employee employee = employeeService.update(
                id,
                dto.getName(),
                dto.getEmail(),
                dto.getRole(),
                dto.getManagerId(),
                userId
        );

        return ResponseEntity.ok(toResponseDTO(employee));
    }
    
 // =========================
    // DELETE
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @RequestHeader("X-USER-ID") UUID userId) {

        employeeService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }


}
