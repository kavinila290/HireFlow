package com.hireflow.hireflowbackend.entity.job;

import jakarta.persistence.*;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String jobType;

    @Column(nullable = false)
    private String experienceLevel;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false)
    private String skills;

    @Column(nullable = false)
    private String applyUrl;

    public Job() {
    }

    public Job(
            String title,
            String company,
            String location,
            String jobType,
            String experienceLevel,
            String description,
            String skills,
            String applyUrl
    ) {
        this.title = title;
        this.company = company;
        this.location = location;
        this.jobType = jobType;
        this.experienceLevel = experienceLevel;
        this.description = description;
        this.skills = skills;
        this.applyUrl = applyUrl;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCompany() {
        return company;
    }

    public String getLocation() {
        return location;
    }

    public String getJobType() {
        return jobType;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public String getDescription() {
        return description;
    }

    public String getSkills() {
        return skills;
    }

    public String getApplyUrl() {
        return applyUrl;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public void setApplyUrl(String applyUrl) {
        this.applyUrl = applyUrl;
    }
}