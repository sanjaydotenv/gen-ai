import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

      await axios.post(
        "/api/auth/register",
        formData,
        { withCredentials: true }
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <header className="auth-nav">
        <Link to="/" className="brand">
          <span className="brand-mark">N</span>
          <span>northstar</span>
        </Link>
      </header>

      <section className="auth-card">
        <div className="auth-icon">✳</div>

        <p className="auth-eyebrow">GET STARTED</p>

        <h1>Create your space.</h1>

        <p className="auth-description">
          Create an account and make room for what matters.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full name</label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              maxLength={50}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              maxLength={128}
              required
            />
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/">Sign in</Link>
        </p>
      </section>

      <p className="auth-footer">
        A clearer way to your next big thing.
      </p>
    </main>
  );
}