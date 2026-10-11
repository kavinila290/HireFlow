
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      localStorage.setItem(
        "hireflowUser",
        JSON.stringify(response.data)
      );

      localStorage.setItem(
        "hireflowToken",
        response.data.token
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Unable to sign in. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page hf-auth-page">
      <div className="hf-auth-shell">
        <aside className="hf-auth-aside">
          <Link to="/" className="hf-auth-brand">
            <span className="hf-auth-brand-mark">H</span>
            <span>HireFlow</span>
          </Link>

          <div className="hf-auth-aside-content">
            <span className="hf-auth-eyebrow">
              YOUR NEXT CHAPTER STARTS HERE
            </span>

            <h1>
              Welcome back.
              <br />
              Your future is <span>waiting.</span>
            </h1>

            <p>
              Sign in to discover opportunities, revisit saved jobs,
              and keep your career journey organized.
            </p>

            <div className="hf-auth-benefits">
              <div className="hf-auth-benefit">
                <span className="hf-auth-benefit-icon">⌕</span>
                <div>
                  <strong>Discover opportunities</strong>
                  <p>Explore jobs that match your goals.</p>
                </div>
              </div>

              <div className="hf-auth-benefit">
                <span className="hf-auth-benefit-icon">♡</span>
                <div>
                  <strong>Keep everything organized</strong>
                  <p>Access saved jobs and applications.</p>
                </div>
              </div>

              <div className="hf-auth-benefit">
                <span className="hf-auth-benefit-icon">↗</span>
                <div>
                  <strong>Move your career forward</strong>
                  <p>Continue your job search with confidence.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="hf-auth-aside-footer">
            Find opportunities. Make your next move.
          </p>
        </aside>

        <section className="hf-auth-form-panel">
          <div className="hf-auth-mobile-brand">
            <Link to="/" className="hf-auth-brand">
              <span className="hf-auth-brand-mark">H</span>
              <span>HireFlow</span>
            </Link>
          </div>

          <div className="hf-auth-form-content">
            <div className="hf-auth-form-heading">
              <span className="hf-auth-step">WELCOME BACK</span>
              <h2>Sign in to HireFlow</h2>
              <p>
                Enter your account details to continue your job search.
              </p>
            </div>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form hf-login-form">
              <div className="form-group">
                <label htmlFor="email">Email address</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button auth-button"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <div className="hf-auth-divider">
              <span>NEW TO HIREFLOW?</span>
            </div>

            <p className="auth-footer hf-auth-register-link">
              Don't have an account?{" "}
              <Link to="/register">Create an account</Link>
            </p>

            <Link to="/" className="hf-auth-back-link">
              <span aria-hidden="true">←</span> Back to Home
            </Link>
          </div>

          <p className="hf-auth-mobile-footer">
            Your career journey, organized with HireFlow.
          </p>
        </section>
      </div>
    </main>
  );
}

export default Login;
