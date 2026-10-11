
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await api.get("/api/saved-jobs");
        setSavedJobs(response.data);
      } catch (err) {
        console.error("Error loading saved jobs:", err);
        setError("Unable to load saved jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleRemove = async (jobId) => {
    setError("");
    setRemovingId(jobId);

    try {
      await api.delete(`/api/saved-jobs/${jobId}`);

      setSavedJobs((previous) =>
        previous.filter((saved) => saved.job?.id !== jobId)
      );
    } catch (err) {
      console.error("Error removing saved job:", err);
      setError(
        err.response?.data?.message ||
          "Unable to remove this saved job. Please try again."
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="jobs-page hf-saved-jobs-page">
      <Navbar />

      <main className="jobs-container">
        <section className="jobs-header">
          <p className="eyebrow">YOUR COLLECTION</p>
          <h1>Saved Jobs</h1>
          <p>Keep track of opportunities you want to explore.</p>
        </section>

        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}

        {loading ? (
          <div className="jobs-empty-state">
            <h3>Loading saved jobs...</h3>
          </div>
        ) : savedJobs.length === 0 && !error ? (
          <div className="jobs-empty-state">
            <div className="empty-icon">♡</div>
            <h3>No saved jobs yet</h3>
            <p>Save a job from the job listings and it will appear here.</p>
            <Link to="/jobs" className="primary-button">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="jobs-list">
            {savedJobs.map((saved) => {
              const job = saved.job;

              if (!job) return null;

              return (
                <article className="job-card" key={saved.id}>
                  <div className="job-card-header">
                    <div>
                      <p className="job-company">{job.company}</p>
                      <h3>{job.title}</h3>
                    </div>
                    <span className="job-type">{job.jobType}</span>
                  </div>

                  <div className="job-meta">
                    <span>📍 {job.location}</span>
                    <span>💼 {job.experienceLevel}</span>
                  </div>

                  <p className="job-description">{job.description}</p>

                  <div className="job-card-footer">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="secondary-button"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      className="primary-button"
                      disabled={removingId === job.id}
                      onClick={() => handleRemove(job.id)}
                    >
                      {removingId === job.id
                        ? "Removing..."
                        : "Remove Saved Job"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default SavedJobs;
