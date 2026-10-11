
package com.hireflow.hireflowbackend.repository;

import com.hireflow.hireflowbackend.entity.application.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    boolean existsByJobIdAndApplicantEmail(
            Long jobId,
            String applicantEmail
    );

    List<Application> findByApplicantEmailIgnoreCase(String applicantEmail);
}
