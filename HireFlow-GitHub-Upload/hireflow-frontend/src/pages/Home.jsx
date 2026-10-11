
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="home-page hf-home">
      <Navbar />

      <main>
        <section className="hf-home-hero">
          <div className="hf-home-hero-content">
            <span className="hf-home-eyebrow">
              YOUR NEXT OPPORTUNITY STARTS HERE
            </span>

            <h1>
              Your career.
              <br />
              Your next <span>big move.</span>
            </h1>

            <p className="hf-home-description">
              Discover opportunities, save jobs that interest you, and
              manage your applications—all in one place with HireFlow.
            </p>

            <div className="hf-home-actions">
              <Link to="/jobs" className="primary-button">
                Explore Jobs <span aria-hidden="true">→</span>
              </Link>

              <Link to="/register" className="secondary-button">
                Create Free Account
              </Link>
            </div>

            <div className="hf-home-benefits">
              <span>✓ Discover opportunities</span>
              <span>✓ Save interesting jobs</span>
              <span>✓ Track applications</span>
            </div>
          </div>

          <div className="hf-home-visual" aria-hidden="true">
            <div className="hf-visual-orbit hf-orbit-one" />
            <div className="hf-visual-orbit hf-orbit-two" />

            <div className="hf-career-card">
              <div className="hf-career-card-top">
                <div className="hf-career-icon">H</div>
                <span className="hf-career-label">YOUR NEXT CHAPTER</span>
              </div>

              <h2>Find a role that moves you forward.</h2>

              <div className="hf-career-divider" />

              <div className="hf-career-row">
                <span className="hf-career-row-icon">⌕</span>
                <div>
                  <strong>Explore opportunities</strong>
                  <p>Find roles that fit your goals</p>
                </div>
                <span className="hf-career-arrow">↗</span>
              </div>

              <div className="hf-career-row">
                <span className="hf-career-row-icon">♡</span>
                <div>
                  <strong>Save jobs for later</strong>
                  <p>Keep your search organized</p>
                </div>
                <span className="hf-career-arrow">↗</span>
              </div>

              <div className="hf-career-row">
                <span className="hf-career-row-icon">✓</span>
                <div>
                  <strong>Track your progress</strong>
                  <p>Keep applications in view</p>
                </div>
                <span className="hf-career-arrow">↗</span>
              </div>
            </div>

            <div className="hf-floating-note">
              <span className="hf-floating-note-icon">✦</span>
              <div>
                <strong>Your journey, organized.</strong>
                <p>One step closer to your goals</p>
              </div>
            </div>
          </div>
        </section>

        <section className="hf-home-features">
          <div className="hf-section-intro">
            <span className="hf-section-label">BUILT FOR YOUR NEXT MOVE</span>
            <h2>A smarter way to manage your job search</h2>
            <p>
              Everything you need to stay organized while working toward
              your next opportunity.
            </p>
          </div>

          <div className="hf-feature-grid">
            <article className="hf-feature-card">
              <div className="hf-feature-icon hf-icon-blue">
                <span aria-hidden="true">⌕</span>
              </div>
              <span className="hf-feature-number">01</span>
              <h3>Discover opportunities</h3>
              <p>
                Search job listings by keywords, location, job type, and
                experience level.
              </p>
              <Link to="/jobs" className="hf-feature-link">
                Explore jobs <span aria-hidden="true">→</span>
              </Link>
            </article>

            <article className="hf-feature-card">
              <div className="hf-feature-icon hf-icon-purple">
                <span aria-hidden="true">♡</span>
              </div>
              <span className="hf-feature-number">02</span>
              <h3>Save what matters</h3>
              <p>
                Keep interesting opportunities together so you can revisit
                them when you're ready.
              </p>
              <Link to="/jobs/saved" className="hf-feature-link">
                View saved jobs <span aria-hidden="true">→</span>
              </Link>
            </article>

            <article className="hf-feature-card">
              <div className="hf-feature-icon hf-icon-teal">
                <span aria-hidden="true">✓</span>
              </div>
              <span className="hf-feature-number">03</span>
              <h3>Stay on track</h3>
              <p>
                Review your submitted applications and keep your job search
                activity organized.
              </p>
              <Link to="/applications" className="hf-feature-link">
                My applications <span aria-hidden="true">→</span>
              </Link>
            </article>
          </div>
        </section>

        <section className="hf-home-cta">
          <div>
            <span className="hf-section-label">READY FOR WHAT'S NEXT?</span>
            <h2>Your next opportunity could be one search away.</h2>
            <p>
              Start exploring jobs and take the next step in your career.
            </p>
          </div>

          <Link to="/jobs" className="primary-button">
            Start Exploring <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>

      <footer className="hf-home-footer">
        <Link to="/" className="hf-footer-brand">
          HireFlow
        </Link>
        <p>Find opportunities. Organize your journey. Move forward.</p>
      </footer>
    </div>
  );
}

export default Home;
