package com.hireflow.hireflowbackend.entity.application;

public class ApplicationRequest {

    private String applicantName;
    private String applicantEmail;

    public ApplicationRequest() {
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getApplicantEmail() {
        return applicantEmail;
    }

    public void setApplicantEmail(String applicantEmail) {
        this.applicantEmail = applicantEmail;
    }
}