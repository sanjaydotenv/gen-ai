import { Form } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const { user, submitting, error } = useSelector((state) => state.auth);

  return (
    <main className="dashboard-page">
      <header className="dashboard-nav">
        <a className="brand" href="/dashboard">
          <span className="brand-mark">G</span>
          <span>Gen-AI</span>
        </a>
        <Form method="post" action="/logout">
          <button className="signout-button" type="submit" disabled={submitting}>
            {submitting ? "Signing out…" : "Sign out"}
          </button>
        </Form>
      </header>
      <section className="welcome-card">
        <span className="welcome-spark" aria-hidden="true">✳</span>
        <p className="eyebrow">YOUR SPACE, IN FOCUS</p>
        <h1>Good to have you here, {user.name}.</h1>
        <p className="welcome-copy">
          You’re signed in as <strong>{user.email}</strong>. This is your space to make room for what matters.
        </p>
        {error && <div className="form-alert dashboard-alert" role="alert">{error}</div>}
        <div className="welcome-divider" />
        <div className="account-status">
          <span className="status-dot" />
          <span>Your account is ready</span>
          <span className="secure-label">Secure session active</span>
        </div>
      </section>
      <p className="dashboard-note">A clearer way to your next big thing.</p>
    </main>
  );
}
