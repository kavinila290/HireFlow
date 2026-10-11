
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/login", {
        replace: true,
        state: { message: "Account created successfully. Please sign in." },
      });
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Unable to create your account. Please check your connection and try again."
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
              Take the next step.
              <br />
              Make it <span>yours.</span>
            </h1>

            <p>
              Create your account and bring your job search into one
              organized place. Your next opportunity starts with a plan.
            </p>

            <div className="hf-auth-benefits">
              <div className="hf-auth-benefit">
                <span className="hf-auth-benefit-icon">⌕</span>
                <div>
                  <strong>Discover your opportunities</strong>
                  <p>Explore roles by skills and location.</p>
                </div>
              </div>

              <div className="hf-auth-benefit">
                <span className="hf-auth-benefit-icon">♡</span>
                <div>
                  <strong>Save jobs you like</strong>
                  <p>Keep interesting roles within reach.</p>
                </div>
              </div>

              <div className="hf-auth-benefit">
                <span className="hf-auth-benefit-icon">✓</span>
                <div>
                  <strong>Organize your applications</strong>
                  <p>Keep track of your job search activity.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="hf-auth-aside-footer">
            Find opportunities. Make your next move.
          </p>
        </aside>

        <section className="hf-auth-form-panel hf-register-panel">
          <div className="hf-auth-mobile-brand">
            <Link to="/" className="hf-auth-brand">
              <span className="hf-auth-brand-mark">H</span>
              <span>HireFlow</span>
            </Link>
          </div>

          <div className="hf-auth-form-content">
            <div className="hf-auth-form-heading">
              <span className="hf-auth-step">GET STARTED</span>
              <h2>Create your account</h2>
              <p>
                Join HireFlow and start organizing your job search.
              </p>
            </div>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="auth-form hf-login-form"
            >
              <div className="form-group">
                <label htmlFor="name">Full name</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

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
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password</label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button auth-button"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <div className="hf-auth-divider">
              <span>ALREADY A MEMBER?</span>
            </div>

            <p className="auth-footer hf-auth-register-link">
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
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

export default Register;
