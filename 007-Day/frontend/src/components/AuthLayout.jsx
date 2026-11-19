import { Link } from "react-router-dom";

export default function AuthLayout({ children, eyebrow, title, description, footer }) {
  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="About Northstar">
        <Link className="brand brand-light" to="/login" aria-label="Northstar home">
          <span className="brand-mark">N</span>
          <span>northstar</span>
        </Link>
        <div className="story-content">
          <span className="story-kicker">A little more focus.</span>
          <h1>Make room for what matters.</h1>
          <p>
            A calmer place to bring your ideas together and move your best work forward.
          </p>
          <div className="story-orbit" aria-hidden="true">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <span className="orbit-core">✳</span>
            <span className="orbit-dot dot-one" />
            <span className="orbit-dot dot-two" />
          </div>
        </div>
        <span className="story-note">A clearer way to your next big thing.</span>
      </section>

      <section className="auth-side">
        <div className="auth-card">
          <Link className="brand brand-mobile" to="/login" aria-label="Northstar home">
            <span className="brand-mark">N</span>
            <span>northstar</span>
          </Link>
          <div className="auth-heading">
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          {children}
          <div className="auth-footer">{footer}</div>
          <p className="legal-note">
            By continuing, you agree to our <a href="#terms">Terms</a> and{" "}
            <a href="#privacy">Privacy Policy</a>.
          </p>
        </div>
        <div className="side-bottom">Thoughtfully made for your next chapter.</div>
      </section>
    </main>
  );
}
