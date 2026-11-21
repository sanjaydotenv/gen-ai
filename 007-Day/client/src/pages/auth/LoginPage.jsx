import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const { data } = await axios.post("/api/auth/login", formData, {
        withCredentials: true,
      });

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <header className="auth-nav">
        <Link to="/login" className="brand">
          <span className="brand-mark">N</span>
          <span>northstar</span>
        </Link>
      </header>

      <section className="auth-card">
        <div className="auth-icon">✳</div>

        <p className="auth-eyebrow">WELCOME BACK</p>

        <h1>Good to see you again.</h1>

        <p className="auth-description">
          Sign in to continue to your personal space.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              maxLength={128}
              required
            />
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>
      </section>

      <p className="auth-footer">A clearer way to your next big thing.</p>
    </main>
  );
}
