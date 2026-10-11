import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/api/applications");

        setApplications(response.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Unable to load your applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="applications-page">

      <Navbar />

      <main className="applications-container">

        <section className="applications-header">
          <p className="eyebrow">YOUR ACTIVITY</p>

          <h1>My Applications</h1>

          <p>
            Track the jobs you have applied for and monitor your application
            status.
          </p>
        </section>

        {loading && (
          <div className="applications-empty-state">
            <h3>Loading applications...</h3>
            <p>Please wait while we retrieve your applications.</p>
          </div>
        )}

        {!loading && error && (
          <div className="applications-empty-state">
            <h3>Unable to load applications</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="applications-empty-state">
            <h3>No applications yet</h3>

            <p>
              You haven't applied to any jobs yet. Start exploring available
              opportunities.
            </p>

            <Link to="/jobs" className="primary-button">
              Browse Jobs
            </Link>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <section className="applications-list">

            <div className="section-heading">
              <div>
                <h2>Applied Jobs</h2>
                <p>
                  {applications.length}{" "}
                  {applications.length === 1
                    ? "application"
                    : "applications"}
                </p>
              </div>
            </div>

            {applications.map((application) => (
              <article
                className="application-card"
                key={application.id}
              >

                <div className="application-card-header">

                  <div>
                    <p className="job-company">
                      {application.job?.company || "Company"}
                    </p>

                    <h3>
                      {application.job?.title || "Job Application"}
                    </h3>
                  </div>

                  <span className="application-status">
                    {application.status || "Applied"}
                  </span>

                </div>

                <div className="application-meta">
                  <span>
                    📍 {application.job?.location || "Location not available"}
                  </span>

                  <span>
                    👤 {application.applicantName}
                  </span>

                  <span>
                    ✉️ {application.applicantEmail}
                  </span>
                </div>

                {application.appliedAt && (
                  <p className="application-date">
                    Applied on{" "}
                    {new Date(application.appliedAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                )}

              </article>
            ))}

          </section>
        )}

      </main>
    </div>
  );
}

export default Applications;