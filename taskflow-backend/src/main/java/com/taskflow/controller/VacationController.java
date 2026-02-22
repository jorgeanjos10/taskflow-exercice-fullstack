package com.taskflow.controller;

import com.taskflow.dto.CreateVacationRequestDTO;
import com.taskflow.dto.UpdateVacationDTO;
import com.taskflow.entity.VacationRequest;
import com.taskflow.service.VacationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vacations")
public class VacationController {

    private final VacationService vacationService;

    public VacationController(VacationService vacationService) {
        this.vacationService = vacationService;
    }

    // =========================
    // CREATE VACATION
    // =========================
    @PostMapping
    public ResponseEntity<VacationRequest> create(
            @RequestBody CreateVacationRequestDTO dto,
            @RequestHeader("X-USER-ID") UUID userId
    ) {

        VacationRequest vacation = vacationService.create(
                dto.getEmployeeId(),
                dto.getStartDate(),
                dto.getEndDate(),
                userId
        );

        return ResponseEntity.ok(vacation);
    }

    // =========================
    // APPROVE VACATION
    // =========================
    @PutMapping("/{id}/approve")
    public ResponseEntity<VacationRequest> approve(
            @PathVariable UUID id,
            @RequestHeader("X-USER-ID") UUID userId
    ) {

        VacationRequest vacation = vacationService.approve(id, userId);

        return ResponseEntity.ok(vacation);
    }

    // =========================
    // REJECT VACATION
    // =========================
    @PutMapping("/{id}/reject")
    public ResponseEntity<VacationRequest> reject(
            @PathVariable UUID id,
            @RequestHeader("X-USER-ID") UUID userId
    ) {

        VacationRequest vacation = vacationService.reject(id, userId);

        return ResponseEntity.ok(vacation);
    }
    
    @GetMapping
    public ResponseEntity<List<VacationRequest>> findAll(
            @RequestHeader("X-USER-ID") UUID userId) {

        return ResponseEntity.ok(
                vacationService.getAll(userId)
        );
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<VacationRequest> update(
            @PathVariable UUID id,
            @RequestBody UpdateVacationDTO dto,
            @RequestHeader("X-USER-ID") UUID userId) {

        return ResponseEntity.ok(
                vacationService.update(
                        id,
                        dto.getStartDate(),
                        dto.getEndDate(),
                        userId
                )
        );
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @RequestHeader("X-USER-ID") UUID userId) {

        vacationService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<VacationRequest> cancel(
            @PathVariable UUID id,
            @RequestHeader("X-USER-ID") UUID userId) {

        return ResponseEntity.ok(
                vacationService.cancel(id, userId)
        );
    }



}
