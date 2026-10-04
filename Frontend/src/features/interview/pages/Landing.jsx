import { Link } from 'react-router'
import '../../../styles/landing.scss'

const Landing = () => (
  <main className="landing-page">
    <div className="landing-shell">
      <header className="landing-header">
        <Link className="landing-brand" to="/" aria-label="CareerPilot home">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>CareerPilot<span className="brand-ai"> AI</span></span>
        </Link>

        <nav className="landing-navigation" aria-label="Account">
          <Link className="nav-login" to="/login">Log in</Link>
          <Link className="nav-register" to="/register">Create account</Link>
        </nav>
      </header>

      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="hero-copy">
          <span className="hero-kicker">
            <span className="kicker-dot" aria-hidden="true" />
            YOUR NEXT CAREER MOVE STARTS HERE
          </span>
          <h1 id="landing-title">
            Your custom
            <span> interview plan,</span>
            powered by AI.
          </h1>
          <p className="hero-description">
            Turn your resume and a job description into a focused plan for your next
            interview—built around the role and the experience you bring.
          </p>
          <div className="hero-actions">
            <Link className="hero-primary" to="/register">
              Build my interview plan
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="hero-secondary" to="/login">I already have an account</Link>
          </div>
          <p className="hero-note">
            <span aria-hidden="true">✦</span>
            Get technical questions, behavioral prompts, and a practical roadmap.
          </p>
        </div>

        <div className="plan-preview" aria-label="Preview of a personalized interview plan">
          <div className="preview-topline">
            <div className="preview-brand">
              <span className="preview-brand-icon" aria-hidden="true">✦</span>
              <span>YOUR PREPARATION</span>
            </div>
            <span className="preview-status"><span /> READY</span>
          </div>

          <div className="preview-title">
            <span className="preview-eyebrow">SAMPLE PLAN PREVIEW</span>
            <h2>Your interview plan</h2>
            <p>Senior Product Designer <span>·</span> tailored preparation</p>
          </div>

          <div className="preview-score">
            <div className="score-ring"><span>86<small>%</small></span></div>
            <div>
              <strong>A strong place to start</strong>
              <span>Your experience, matched to the role</span>
            </div>
          </div>

          <div className="preview-sections">
            <div className="preview-section">
              <span className="section-number">01</span>
              <span><strong>Technical questions</strong><small>Practice role-specific skills</small></span>
              <span className="section-arrow" aria-hidden="true">›</span>
            </div>
            <div className="preview-section">
              <span className="section-number">02</span>
              <span><strong>Behavioral questions</strong><small>Tell your story with confidence</small></span>
              <span className="section-arrow" aria-hidden="true">›</span>
            </div>
            <div className="preview-section">
              <span className="section-number">03</span>
              <span><strong>Your preparation roadmap</strong><small>A focused plan for what to do next</small></span>
              <span className="section-arrow" aria-hidden="true">›</span>
            </div>
          </div>

          <div className="preview-footer">
            <span className="preview-spark" aria-hidden="true">✦</span>
            Shaped around your experience and goals
          </div>
        </div>
      </section>

      <section className="landing-benefits" aria-label="How CareerPilot helps">
        <article className="benefit">
          <span className="benefit-icon" aria-hidden="true">01</span>
          <div>
            <h2>Made for your target role</h2>
            <p>Bring the job description and focus on what matters for that opportunity.</p>
          </div>
        </article>
        <article className="benefit">
          <span className="benefit-icon" aria-hidden="true">02</span>
          <div>
            <h2>Built around your experience</h2>
            <p>Use your resume or a quick profile description to make preparation personal.</p>
          </div>
        </article>
        <article className="benefit">
          <span className="benefit-icon" aria-hidden="true">03</span>
          <div>
            <h2>One clear plan</h2>
            <p>Review technical prompts, behavioral questions, and a preparation roadmap.</p>
          </div>
        </article>
      </section>

      <footer className="landing-footer">
        <span>CareerPilot AI</span>
        <span>Prepare with purpose. Show up with confidence.</span>
      </footer>
    </div>
  </main>
)

export default Landing
