
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem("hireflowToken"))
  );

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("hireflowToken")));
  }, [location.pathname]);

  const getNavClass = ({ isActive }) =>
    `hf-nav-link${isActive ? " hf-nav-link-active" : ""}`;

  const handleLogout = () => {
    localStorage.removeItem("hireflowToken");
    localStorage.removeItem("hireflowUser");
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="hf-site-header">
      <div className="hf-header-inner">
        <Link to="/" className="hf-brand" aria-label="HireFlow home">
          <span className="hf-brand-mark">H</span>
          <span className="hf-brand-name">HireFlow</span>
        </Link>

        <nav className="hf-main-nav" aria-label="Main navigation">
          {isAuthenticated && (
            <NavLink to="/dashboard" className={getNavClass}>
              Dashboard
            </NavLink>
          )}

          <NavLink to="/jobs" className={getNavClass}>
            Find Jobs
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/jobs/saved" className={getNavClass}>
                Saved Jobs
              </NavLink>

              <NavLink to="/applications" className={getNavClass}>
                My Applications
              </NavLink>
            </>
          )}
        </nav>

        <div className="hf-header-actions">
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className={getNavClass}>
                My Profile
              </NavLink>

              <button
                type="button"
                className="hf-nav-link"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={getNavClass}>
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `hf-nav-link hf-nav-register${
                    isActive ? " hf-nav-link-active" : ""
                  }`
                }
              >
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
