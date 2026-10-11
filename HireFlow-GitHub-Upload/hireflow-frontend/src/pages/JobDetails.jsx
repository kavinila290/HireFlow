
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchJob = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/api/jobs/${id}`);

        if (isMounted) {
          setJob(response.data);
        }

        if (localStorage.getItem("hireflowToken")) {
          try {
            const savedResponse = await api.get("/api/saved-jobs");

            const saved = savedResponse.data.some(
              (item) => String(item.job?.id) === String(id)
            );

            if (isMounted) {
              setIsSaved(saved);
            }
          } catch (savedError) {
            console.error("Unable to check saved job:", savedError);
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error);

        if (isMounted) {
          setJob(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJob();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleToggleSaved = async () => {
    if (!localStorage.getItem("hireflowToken")) {
      navigate("/login");
      return;
    }

    setSavingJob(true);
    setSaveMessage("");

    try {
      if (isSaved) {
        await api.delete(`/api/saved-jobs/${id}`);
        setIsSaved(false);
        setSaveMessage("Job removed from your saved jobs.");
      } else {
        await api.post(`/api/saved-jobs/${id}`);
        setIsSaved(true);
        setSaveMessage("Job saved successfully.");
      }
    } catch (error) {
      console.error("Error updating saved job:", error);

      const status = error.response?.status;

      if (status === 401 || status === 403) {
        setSaveMessage(
          "Your session may have expired. Please log in again."
        );
      } else {
        setSaveMessage(
          error.response?.data?.message ||
            "Unable to update saved job. Please try again."
        );
      }
    } finally {
      setSavingJob(false);
    }
  };

  const handleApply = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    if (!localStorage.getItem("hireflowToken")) {
      navigate("/login");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await api.post(
        `/api/applications/apply/${id}`,
        {
          applicantName: applicantName.trim(),
          applicantEmail: applicantEmail.trim(),
        }
      );

      if (response.status === 201 || response.status === 200) {
        setMessage("Application submitted successfully!");
        setApplicantName("");
        setApplicantEmail("");
        setShowForm(false);
      }
    } catch (error) {
      console.error("Application error:", error);

      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      if (status === 401 || status === 403) {
        setMessage(
          "Your session may have expired. Please log in again before applying."
        );
      } else if (serverMessage) {
        setMessage(serverMessage);
      } else {
        setMessage("Failed to submit application. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="job-details-page hf-job-details-page">
        <Navbar />
        <main className="hf-job-details-container">
          <div className="hf-details-state">
            <div className="hf-details-loading-icon">⌕</div>
            <h2>Loading job details...</h2>
            <p>Please wait while we retrieve this opportunity.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page hf-job-details-page">
        <Navbar />
        <main className="hf-job-details-container">
          <div className="hf-details-state">
            <div className="hf-details-loading-icon">!</div>
            <h2>Job not found</h2>
            <p>
              This opportunity may no longer be available. Explore other
              listings to find your next move.
            </p>
            <Link to="/jobs" className="primary-button">
              Browse Jobs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const skillItems = (
    Array.isArray(job.skills)
      ? job.skills
      : String(job.skills || "").split(",")
  )
    .map((skill) => String(skill).trim())
    .filter(Boolean);

  return (
    <div className="job-details-page hf-job-details-page">
      <Navbar />

      <main className="hf-job-details-container">
        <div className="hf-job-details-toolbar">
          <Link to="/jobs" className="hf-back-link">
            <span aria-hidden="true">←</span> Back to jobs
          </Link>
          <span className="hf-details-breadcrumb">
            Job details / {job.title}
          </span>
        </div>

        <div className="hf-job-details-layout">
          <div className="job-details-card hf-job-content-card">
            <header className="job-details-header hf-job-details-header">
              <div className="hf-job-heading">
                <div className="hf-company-mark">
                  {(job.company || "C").trim().charAt(0).toUpperCase()}
                </div>

                <div className="hf-job-title-group">
                  <p className="job-company">
                    {job.company || "Company"}
                  </p>
                  <h1>{job.title}</h1>
                </div>
              </div>

              <span className="job-type-badge hf-job-type-badge">
                {job.jobType || "Job opportunity"}
              </span>
            </header>

            <div className="job-details-meta hf-job-details-meta">
              <span>
                <span aria-hidden="true">⌖</span>
                {job.location || "Location not specified"}
              </span>

              {job.experienceLevel && (
                <span>
                  <span aria-hidden="true">◷</span>
                  {job.experienceLevel}
                </span>
              )}
            </div>

            <div className="hf-details-divider" />

            <section className="hf-details-section">
              <h2>About the role</h2>
              <p className="hf-job-long-description">
                {job.description || "No job description is available yet."}
              </p>
            </section>

            <section className="hf-details-section">
              <h2>Skills and qualifications</h2>

              {skillItems.length > 0 ? (
                <div className="hf-details-skill-list">
                  {skillItems.map((skill, index) => (
                    <span key={`${skill}-${index}`}>{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="hf-job-long-description">
                  No specific skills have been listed.
                </p>
              )}
            </section>

            {job.applyUrl && (
              <section className="hf-details-section">
                <h2>External application</h2>
                <p className="hf-job-long-description">
                  This listing also includes an external application link.
                </p>
                <a
                  className="secondary-button hf-external-apply"
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit application website ↗
                </a>
              </section>
            )}

            {message && (
              <div
                className="application-message hf-application-message"
                role="status"
              >
                <p>{message}</p>

                {message.includes("successfully") && (
                  <Link
                    to="/applications"
                    className="secondary-button"
                  >
                    View Applications
                  </Link>
                )}
              </div>
            )}

            {showForm && (
              <section className="application-form hf-application-form">
                <div className="hf-application-form-heading">
                  <span className="hf-auth-step">APPLICATION</span>
                  <h2>Apply for this position</h2>
                  <p>
                    Submit your details for{" "}
                    <strong>{job.title}</strong>.
                  </p>
                </div>

                <form onSubmit={handleApply}>
                  <div className="form-group">
                    <label htmlFor="applicantName">Full name</label>
                    <input
                      id="applicantName"
                      type="text"
                      value={applicantName}
                      onChange={(event) =>
                        setApplicantName(event.target.value)
                      }
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="applicantEmail">Email address</label>
                    <input
                      id="applicantEmail"
                      type="email"
                      value={applicantEmail}
                      onChange={(event) =>
                        setApplicantEmail(event.target.value)
                      }
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="application-form-actions">
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={submitting}
                    >
                      {submitting
                        ? "Submitting..."
                        : "Submit Application"}
                    </button>

                    <button
                      type="button"
                      className="secondary-button"
                      disabled={submitting}
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            )}
          </div>

          <aside className="hf-job-details-sidebar">
            <section className="hf-job-action-card">
              <span className="hf-action-card-label">
                YOUR NEXT OPPORTUNITY
              </span>

              <h2>Interested in this role?</h2>

              <p>
                Take the next step and submit your application when you're
                ready.
              </p>

              <button
                type="button"
                className="primary-button hf-detail-apply-button"
                onClick={() => {
                  if (!localStorage.getItem("hireflowToken")) {
                    navigate("/login");
                    return;
                  }

                  setMessage("");
                  setShowForm(true);
                }}
              >
                Apply Now <span aria-hidden="true">→</span>
              </button>

              <button
                type="button"
                className="secondary-button hf-detail-save-button"
                disabled={savingJob}
                onClick={handleToggleSaved}
              >
                {savingJob
                  ? "Please wait..."
                  : isSaved
                    ? "♥ Saved · Remove"
                    : "♡ Save this job"}
              </button>

              {saveMessage && (
                <p className="hf-save-feedback" role="status">
                  {saveMessage}
                </p>
              )}

              <Link
                to="/applications"
                className="hf-applications-link"
              >
                View my applications →
              </Link>
            </section>

            <section className="hf-job-tip-card">
              <span className="hf-job-tip-icon" aria-hidden="true">
                ✦
              </span>
              <h3>Keep your search organized</h3>
              <p>
                Save opportunities that interest you and revisit them from
                your Saved Jobs page.
              </p>
              <Link to="/jobs/saved">View saved jobs →</Link>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default JobDetails;
