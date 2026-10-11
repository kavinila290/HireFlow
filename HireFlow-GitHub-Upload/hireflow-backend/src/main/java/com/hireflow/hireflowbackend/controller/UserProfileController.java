package com.hireflow.hireflowbackend.controller;

import com.hireflow.hireflowbackend.entity.user.User;
import com.hireflow.hireflowbackend.entity.user.UserProfile;
import com.hireflow.hireflowbackend.repository.UserRepository;
import com.hireflow.hireflowbackend.service.UserProfileService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final UserRepository userRepository;

    public UserProfileController(
            UserProfileService userProfileService,
            UserRepository userRepository
    ) {
        this.userProfileService = userProfileService;
        this.userRepository = userRepository;
    }

    private boolean ownsProfile(Long userId, Principal principal) {
        if (principal == null || principal.getName() == null) {
            return false;
        }

        User user = userRepository.findByEmail(principal.getName())
        .orElse(null);

return user != null && user.getId().equals(userId);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfile> getProfile(
            @PathVariable Long userId,
            Principal principal
    ) {
        if (!ownsProfile(userId, principal)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(
                userProfileService.getProfile(userId)
        );
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserProfile> updateProfile(
            @PathVariable Long userId,
            @RequestBody UserProfile profile,
            Principal principal
    ) {
        if (!ownsProfile(userId, principal)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(
                userProfileService.updateProfile(userId, profile)
        );
    }
}