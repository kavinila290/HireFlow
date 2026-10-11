package com.hireflow.hireflowbackend.controller;

import com.hireflow.hireflowbackend.entity.application.Application;
import com.hireflow.hireflowbackend.entity.application.ApplicationRequest;
import com.hireflow.hireflowbackend.service.ApplicationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<Application> applyForJob(
            @PathVariable Long jobId,
            @RequestBody ApplicationRequest request,
            Principal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Use the authenticated user's email.
        Application application = applicationService.applyForJob(
        jobId,
        request.getApplicantName(),
        principal.getName()
);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(application);
    }

    @GetMapping
    public ResponseEntity<List<Application>> getMyApplications(
            Principal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(
                applicationService.getApplicationsByEmail(
                        principal.getName()
                )
        );
    }
}
