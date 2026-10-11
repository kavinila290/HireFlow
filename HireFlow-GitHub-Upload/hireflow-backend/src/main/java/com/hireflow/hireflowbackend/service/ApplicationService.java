package com.hireflow.hireflowbackend.service;

import com.hireflow.hireflowbackend.entity.application.Application;
import com.hireflow.hireflowbackend.entity.job.Job;
import com.hireflow.hireflowbackend.repository.ApplicationRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobService jobService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobService jobService
    ) {
        this.applicationRepository = applicationRepository;
        this.jobService = jobService;
    }

    public Application applyForJob(
        Long jobId,
        String applicantName,
        String applicantEmail
) {

    if (applicationRepository.existsByJobIdAndApplicantEmail(
            jobId,
            applicantEmail
    )) {
        throw new IllegalArgumentException(
                "You have already applied for this job."
        );
    }

    Job job = jobService.getJobById(jobId);

    Application application = new Application();

    application.setJob(job);
    application.setApplicantName(applicantName);
    application.setApplicantEmail(applicantEmail);
    application.setStatus("Applied");
    application.setAppliedAt(LocalDateTime.now());

    return applicationRepository.save(application);
}


public List<Application> getApplicationsByEmail(String email) {
    return applicationRepository.findByApplicantEmailIgnoreCase(email);
}

}
