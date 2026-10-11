
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Jobs() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [savingJobId, setSavingJobId] = useState(null);
  const [actionError, setActionError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/jobs");

        setJobs(response.data);
        setFilteredJobs(response.data);

        if (localStorage.getItem("hireflowToken")) {
          try {
            const savedResponse = await api.get("/api/saved-jobs");

            const savedIds = savedResponse.data
              .map((savedJob) => savedJob.job?.id)
              .filter((id) => id !== undefined && id !== null);

            setSavedJobs(savedIds);
          } catch (savedError) {
            console.error("Unable to load saved jobs:", savedError);
          }
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(
          "Unable to load jobs. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const searchTerm = search.trim().toLowerCase();
    const locationTerm = location.trim().toLowerCase();

    const results = jobs.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        (job.title || "").toLowerCase().includes(searchTerm) ||
        (job.company || "").toLowerCase().includes(searchTerm) ||
        (job.skills || "").toLowerCase().includes(searchTerm);

      const matchesLocation =
        !locationTerm ||
        (job.location || "").toLowerCase().includes(locationTerm);

      const matchesJobType =
        !jobType || (job.jobType || "") === jobType;

      const matchesExperience =
        !experienceLevel ||
        (job.experienceLevel || "") === experienceLevel;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesJobType &&
        matchesExperience
      );
    });

    setFilteredJobs(results);
  };

  const clearSearch = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setExperienceLevel("");
    setFilteredJobs(jobs);
  };

  const handleSaveJob = async (jobId) => {
    if (!localStorage.getItem("hireflowToken")) {
      navigate("/login");
      return;
    }

    setActionError("");
    setSavingJobId(jobId);

    try {
      if (savedJobs.includes(jobId)) {
        await api.delete(`/api/saved-jobs/${jobId}`);

        setSavedJobs((previous) =>
          previous.filter((id) => id !== jobId)
        );
      } else {
        await api.post(`/api/saved-jobs/${jobId}`);

        setSavedJobs((previous) =>
          previous.includes(jobId) ? previous : [...previous, jobId]
        );
      }
    } catch (err) {
      console.error("Error updating saved job:", err);

      setActionError(
        err.response?.data?.message ||
          "Unable to update saved job. Please try again."
      );
    } finally {
      setSavingJobId(null);
    }
  };

  return (
    <div className="jobs-page">

     <Navbar />
      <main className="jobs-container">
        <section className="jobs-header">
          <div>
            <p className="eyebrow">OPPORTUNITIES</p>
            <h1>Find your next job</h1>
            <p>
              Search for opportunities and discover roles that match your
              career goals.
            </p>
          </div>
        </section>

        <form onSubmit={handleSearch} className="job-search">
          <div className="search-field">
            <label htmlFor="job-search">What are you looking for?</label>
            <input
              id="job-search"
              type="text"
              placeholder="Job title, skills, or keywords"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="search-field">
            <label htmlFor="job-location">Location</label>
            <input
              id="job-location"
              type="text"
              placeholder="City or remote"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>

          <div className="search-field">
            <label htmlFor="job-type">Job Type</label>
            <select
              id="job-type"
              value={jobType}
              onChange={(event) => setJobType(event.target.value)}
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="search-field">
            <label htmlFor="experience-level">Experience</label>
            <select
              id="experience-level"
              value={experienceLevel}
              onChange={(event) => setExperienceLevel(event.target.value)}
            >
              <option value="">All Experience Levels</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Junior">Junior</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <button type="submit" className="primary-button search-button">
            Search Jobs
          </button>
        </form>

        <section className="jobs-section">
          <div className="section-heading">
            <div>
              <h2>Available Jobs</h2>
              <p>
                {loading
                  ? "Loading opportunities..."
                  : "Explore available opportunities."}
              </p>
            </div>

            <span className="job-count">
              {filteredJobs.length}{" "}
              {filteredJobs.length === 1 ? "job" : "jobs"}
            </span>
          </div>

          {actionError && (
            <p role="alert" className="error-message">
              {actionError}
            </p>
          )}

          {loading && (
            <div className="jobs-empty-state">
              <div className="empty-icon">⏳</div>
              <h3>Loading jobs...</h3>
              <p>Please wait while we load the latest opportunities.</p>
            </div>
          )}

          {!loading && error && (
            <div className="jobs-empty-state">
              <div className="empty-icon">⚠️</div>
              <h3>Unable to load jobs</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredJobs.length === 0 && (
            <div className="jobs-empty-state">
              <div className="empty-icon">🔎</div>
              <h3>
                {jobs.length === 0
                  ? "No jobs available yet"
                  : "No matching jobs found"}
              </h3>
              <p>
                {jobs.length === 0
                  ? "Once job listings are added, they will appear here."
                  : "Try changing your search keywords or location."}
              </p>

              {jobs.length > 0 && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={clearSearch}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {!loading && !error && filteredJobs.length > 0 && (
            <div className="jobs-list">
              {filteredJobs.map((job) => {
                const isSaved = savedJobs.includes(job.id);

                return (
                  <article className="job-card" key={job.id}>
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

                    <div className="job-skills">
                      {(job.skills || "")
                        .split(",")
                        .filter((skill) => skill.trim())
                        .map((skill) => (
                          <span key={skill.trim()}>{skill.trim()}</span>
                        ))}
                    </div>

                    <div className="job-card-footer">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="secondary-button"
                      >
                        View Details
                      </Link>

                      <Link
                        to={`/jobs/${job.id}`}
                        className="primary-button"
                      >
                        Apply Now
                      </Link>

                      <button
                        type="button"
                        className="secondary-button"
                        disabled={savingJobId === job.id}
                        onClick={() => handleSaveJob(job.id)}
                      >
                        {savingJobId === job.id
                          ? "Please wait..."
                          : isSaved
                            ? "♥ Remove Saved"
                            : "♡ Save Job"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Jobs;
