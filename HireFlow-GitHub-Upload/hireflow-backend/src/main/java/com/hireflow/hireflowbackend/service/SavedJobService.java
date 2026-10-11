
package com.hireflow.hireflowbackend.service;

import com.hireflow.hireflowbackend.entity.job.Job;
import com.hireflow.hireflowbackend.entity.savedjob.SavedJob;
import com.hireflow.hireflowbackend.entity.user.User;
import com.hireflow.hireflowbackend.repository.SavedJobRepository;
import com.hireflow.hireflowbackend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final UserRepository userRepository;
    private final JobService jobService;

    public SavedJobService(
            SavedJobRepository savedJobRepository,
            UserRepository userRepository,
            JobService jobService
    ) {
        this.savedJobRepository = savedJobRepository;
        this.userRepository = userRepository;
        this.jobService = jobService;
    }

    public SavedJob saveJob(Long userId, Long jobId) {

        if (savedJobRepository.existsByUserIdAndJobId(userId, jobId)) {
            throw new IllegalArgumentException("Job is already saved.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        Job job = jobService.getJobById(jobId);

        SavedJob savedJob = new SavedJob();
        savedJob.setUser(user);
        savedJob.setJob(job);
        savedJob.setSavedAt(LocalDateTime.now());

        return savedJobRepository.save(savedJob);
    }

    public List<SavedJob> getSavedJobs(Long userId) {
        return savedJobRepository.findByUserId(userId);
    }

    @Transactional
    public void removeSavedJob(Long userId, Long jobId) {

        SavedJob savedJob = savedJobRepository
                .findByUserIdAndJobId(userId, jobId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Saved job not found.")
                );

        savedJobRepository.delete(savedJob);
        savedJobRepository.flush();
    }

    public boolean isJobSaved(Long userId, Long jobId) {
        return savedJobRepository.existsByUserIdAndJobId(userId, jobId);
    }
}
