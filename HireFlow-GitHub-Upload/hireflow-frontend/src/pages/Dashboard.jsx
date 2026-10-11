
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("hireflowUser");
    const token = localStorage.getItem("hireflowToken");

    if (!storedUser || !token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser || !parsedUser.email) {
        throw new Error("Invalid stored user data");
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Invalid stored user data:", error);
      localStorage.removeItem("hireflowUser");
      localStorage.removeItem("hireflowToken");
      navigate("/login", { replace: true });
      return;
    }

    let active = true;

    const fetchDashboardData = async () => {
      const applicationsRequest = api
        .get("/api/applications")
        .then((response) => {
          if (active) {
            setApplications(
              Array.isArray(response.data) ? response.data : []
            );
            setApplicationsError("");
          }
        })
        .catch((error) => {
          console.error("Error fetching applications:", error);

          if (active) {
            setApplicationsError(
              "Unable to load your applications. Please try again."
            );
          }
        });

      const savedJobsRequest = api
        .get("/api/saved-jobs")
        .then((response) => {
          if (active) {
            setSavedJobsCount(
              Array.isArray(response.data) ? response.data.length : 0
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching saved jobs:", error);
        });

      await Promise.all([applicationsRequest, savedJobsRequest]);

      if (active) {
        setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("hireflowUser");
    localStorage.removeItem("hireflowToken");
    navigate("/login", { replace: true });
  };

  const interviewCount = applications.filter(
    (application) =>
      (application.status || "").toLowerCase() === "interview"
  ).length;

  const offerCount = applications.filter(
    (application) =>
      (application.status || "").toLowerCase() === "offer"
  ).length;

  if (!user) {
    return null;
  }

  const firstName = user.name?.trim().split(/\s+/)[0] || "there";

  return (
    <div className="dashboard-page hf-dashboard-page">
      <Navbar />

      <main className="dashboard-container hf-dashboard-container">
        <section className="dashboard-header hf-dashboard-hero">
          <div className="hf-dashboard-greeting">
            <p className="eyebrow">YOUR CAREER DASHBOARD</p>

            <h1>Welcome back, {firstName}!</h1>

            <p className="hf-dashboard-description">
              Your next opportunity starts with one small step. Keep your
              job search organized and moving forward.
            </p>

            <div className="hf-dashboard-caption">
              <span className="hf-dashboard-dot" />
              Your job search, all in one place
            </div>
          </div>

          <div className="hf-dashboard-header-actions">
            <Link to="/jobs" className="primary-button">
              Explore Jobs <span aria-hidden="true">→</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="hf-logout-button"
            >
              Sign out
            </button>
          </div>
        </section>

        <section className="stats-grid hf-dashboard-stats">
          <article className="stat-card hf-stat-card hf-stat-blue">
            <div className="hf-stat-top">
              <span className="stat-label">Applications</span>
              <span className="hf-stat-icon" aria-hidden="true">
                ↗
              </span>
            </div>

            <strong>{loading ? "—" : applications.length}</strong>
            <p>Jobs you've applied for</p>
          </article>

          <article className="stat-card hf-stat-card hf-stat-purple">
            <div className="hf-stat-top">
              <span className="stat-label">Interviews</span>
              <span className="hf-stat-icon" aria-hidden="true">
                ◷
              </span>
            </div>

            <strong>{loading ? "—" : interviewCount}</strong>
            <p>Interview-stage applications</p>
          </article>

          <article className="stat-card hf-stat-card hf-stat-teal">
            <div className="hf-stat-top">
              <span className="stat-label">Saved Jobs</span>
              <span className="hf-stat-icon" aria-hidden="true">
                ♡
              </span>
            </div>

            <strong>{loading ? "—" : savedJobsCount}</strong>
            <p>Opportunities to revisit</p>

            <Link to="/jobs/saved" className="hf-stat-link">
              View saved jobs →
            </Link>
          </article>

          <article className="stat-card hf-stat-card hf-stat-orange">
            <div className="hf-stat-top">
              <span className="stat-label">Offers</span>
              <span className="hf-stat-icon" aria-hidden="true">
                ✦
              </span>
            </div>

            <strong>{loading ? "—" : offerCount}</strong>
            <p>Applications marked as offers</p>
          </article>
        </section>

        <section className="dashboard-grid hf-dashboard-grid">
          <section className="dashboard-card hf-dashboard-panel">
            <div className="card-header hf-panel-header">
              <div>
                <p className="hf-panel-eyebrow">YOUR PROGRESS</p>
                <h2>Recent Applications</h2>
                <p>Your latest job application activity.</p>
              </div>

              <Link to="/applications" className="hf-panel-link">
                View all <span aria-hidden="true">→</span>
              </Link>
            </div>

            {loading && (
              <div className="empty-state hf-dashboard-empty">
                <div className="empty-icon">◌</div>
                <h3>Loading your activity</h3>
                <p>Retrieving your latest applications and saved jobs.</p>
              </div>
            )}

            {!loading && applicationsError && (
              <div className="empty-state hf-dashboard-empty">
                <div className="empty-icon">!</div>
                <h3>Applications unavailable</h3>
                <p>{applicationsError}</p>

                <Link to="/applications" className="secondary-button">
                  Open Applications
                </Link>
              </div>
            )}

            {!loading &&
              !applicationsError &&
              applications.length === 0 && (
                <div className="empty-state hf-dashboard-empty">
                  <div className="empty-icon">⌕</div>
                  <h3>Your journey starts here</h3>
                  <p>
                    Explore available roles and your submitted applications
                    will appear here.
                  </p>

                  <Link to="/jobs" className="secondary-button">
                    Find Your First Job
                  </Link>
                </div>
              )}

            {!loading &&
              !applicationsError &&
              applications.length > 0 && (
                <div className="recent-applications hf-recent-applications">
                  {applications.slice(0, 3).map((application) => (
                    <article
                      className="recent-application-item hf-recent-item"
                      key={application.id}
                    >
                      <div className="hf-company-avatar" aria-hidden="true">
                        {(application.job?.company || "C")
                          .trim()
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="hf-recent-details">
                        <strong>
                          {application.job?.title || "Job Application"}
                        </strong>

                        <p>
                          {application.job?.company || "Company"}
                        </p>

                        {application.appliedAt && (
                          <span className="hf-recent-date">
                            Applied{" "}
                            {new Date(
                              application.appliedAt
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>

                      <span className="application-status hf-status-pill">
                        {application.status || "Applied"}
                      </span>
                    </article>
                  ))}
                </div>
              )}
          </section>

          <section className="dashboard-card hf-dashboard-panel">
            <div className="card-header hf-panel-header">
              <div>
                <p className="hf-panel-eyebrow">STAY PRODUCTIVE</p>
                <h2>Quick Actions</h2>
                <p>Everything you need, one click away.</p>
              </div>
            </div>

            <div className="quick-actions hf-quick-actions">
              <Link to="/jobs" className="action-item hf-quick-action">
                <span className="action-icon hf-quick-icon hf-quick-blue">
                  ⌕
                </span>

                <div>
                  <strong>Find Jobs</strong>
                  <p>Discover new opportunities</p>
                </div>

                <span className="hf-quick-arrow" aria-hidden="true">
                  →
                </span>
              </Link>

              <Link
                to="/jobs/saved"
                className="action-item hf-quick-action"
              >
                <span className="action-icon hf-quick-icon hf-quick-purple">
                  ♡
                </span>

                <div>
                  <strong>Saved Jobs</strong>
                  <p>Revisit interesting roles</p>
                </div>

                <span className="hf-quick-arrow" aria-hidden="true">
                  →
                </span>
              </Link>

              <Link
                to="/applications"
                className="action-item hf-quick-action"
              >
                <span className="action-icon hf-quick-icon hf-quick-teal">
                  ✓
                </span>

                <div>
                  <strong>My Applications</strong>
                  <p>Review your application activity</p>
                </div>

                <span className="hf-quick-arrow" aria-hidden="true">
                  →
                </span>
              </Link>

              <Link to="/profile" className="action-item hf-quick-action">
                <span className="action-icon hf-quick-icon hf-quick-orange">
                  ◉
                </span>

                <div>
                  <strong>My Profile</strong>
                  <p>Keep your information up to date</p>
                </div>

                <span className="hf-quick-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
