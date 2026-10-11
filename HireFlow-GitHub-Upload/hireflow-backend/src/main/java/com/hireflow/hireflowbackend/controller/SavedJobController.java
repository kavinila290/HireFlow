
package com.hireflow.hireflowbackend.controller;

import com.hireflow.hireflowbackend.entity.savedjob.SavedJob;
import com.hireflow.hireflowbackend.entity.user.User;
import com.hireflow.hireflowbackend.repository.UserRepository;
import com.hireflow.hireflowbackend.service.SavedJobService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-jobs")
public class SavedJobController {

    private final SavedJobService savedJobService;
    private final UserRepository userRepository;

    public SavedJobController(
            SavedJobService savedJobService,
            UserRepository userRepository
    ) {
        this.savedJobService = savedJobService;
        this.userRepository = userRepository;
    }

    private Long getAuthenticatedUserId(Principal principal) {
        if (principal == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in first."
            );
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Authenticated user not found."
                ));

        return user.getId();
    }

    @PostMapping("/{jobId}")
    public ResponseEntity<SavedJob> saveJob(
            @PathVariable Long jobId,
            Principal principal
    ) {
        Long userId = getAuthenticatedUserId(principal);

        SavedJob savedJob = savedJobService.saveJob(userId, jobId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedJob);
    }

    @GetMapping
    public ResponseEntity<List<SavedJob>> getSavedJobs(
            Principal principal
    ) {
        Long userId = getAuthenticatedUserId(principal);

        return ResponseEntity.ok(
                savedJobService.getSavedJobs(userId)
        );
    }

    @GetMapping("/{jobId}/status")
    public ResponseEntity<Map<String, Boolean>> checkSavedJob(
            @PathVariable Long jobId,
            Principal principal
    ) {
        Long userId = getAuthenticatedUserId(principal);

        boolean saved = savedJobService.isJobSaved(userId, jobId);

        return ResponseEntity.ok(Map.of("saved", saved));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> removeSavedJob(
            @PathVariable Long jobId,
            Principal principal
    ) {
        Long userId = getAuthenticatedUserId(principal);

        savedJobService.removeSavedJob(userId, jobId);

        return ResponseEntity.noContent().build();
    }
}
