package com.hireflow.hireflowbackend.service;

import com.hireflow.hireflowbackend.entity.user.User;
import com.hireflow.hireflowbackend.entity.user.UserProfile;
import com.hireflow.hireflowbackend.repository.UserProfileRepository;
import com.hireflow.hireflowbackend.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileService(
            UserProfileRepository userProfileRepository,
            UserRepository userRepository
    ) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }

    public UserProfile getProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        return userProfileRepository.findByUserId(userId)
                .orElseGet(() -> {

                    UserProfile profile = new UserProfile();
                    profile.setUser(user);

                    return userProfileRepository.save(profile);
                });
    }

    public UserProfile updateProfile(
            Long userId,
            UserProfile profileData
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        UserProfile profile = userProfileRepository
                .findByUserId(userId)
                .orElseGet(UserProfile::new);

        profile.setUser(user);
        profile.setPhone(profileData.getPhone());
        profile.setLocation(profileData.getLocation());
        profile.setHeadline(profileData.getHeadline());
        profile.setBio(profileData.getBio());
        profile.setSkills(profileData.getSkills());

        return userProfileRepository.save(profile);
    }
}