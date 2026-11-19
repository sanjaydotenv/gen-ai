import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../components/AuthLayout.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { clearAuthError, registerUser } from "../store/slices/authSlice.js";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const { submitting, error: reduxError, fieldErrors } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: "" });
    dispatch(clearAuthError());
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Name must be at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (form.password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (new TextEncoder().encode(form.password).length > 72) {
      nextErrors.password = "Password must be no more than 72 bytes.";
    }
    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const result = await dispatch(registerUser({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    }));
    if (registerUser.fulfilled.match(result)) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <AuthLayout
      eyebrow="Start something good"
      title="Create your account"
      description="Your next chapter starts with a few details."
      footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
    >
      <form className="auth-form register-form" onSubmit={submit} noValidate>
        {(reduxError || fieldErrors.name || fieldErrors.email || fieldErrors.password) && (
          <div className="form-alert" role="alert">
            {reduxError || "Please check the information you entered."}
          </div>
        )}
        <div className="field">
          <label htmlFor="name">Your name</label>
          <div className={`input-wrap ${errors.name ? "input-invalid" : ""}`}>
            <span className="input-icon" aria-hidden="true">♙</span>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={update}
              placeholder="Alex Morgan"
              autoComplete="name"
              minLength={2}
              maxLength={80}
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </div>
          {(errors.name || fieldErrors.name?.[0]) && (
            <span className="field-error" id="name-error">
              {errors.name || fieldErrors.name[0]}
            </span>
          )}
        </div>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <div className={`input-wrap ${errors.email ? "input-invalid" : ""}`}>
            <span className="input-icon" aria-hidden="true">✉</span>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={254}
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </div>
          {(errors.email || fieldErrors.email?.[0]) && (
            <span className="field-error" id="email-error">
              {errors.email || fieldErrors.email[0]}
            </span>
          )}
        </div>
        <PasswordInput
          id="password"
          label="Password"
          value={form.password}
          onChange={update}
          autoComplete="new-password"
          error={errors.password || fieldErrors.password?.[0]}
        />
        <PasswordInput
          id="confirmPassword"
          label="Confirm password"
          value={form.confirmPassword}
          onChange={update}
          placeholder="Enter your password again"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />
        <button className="submit-button" type="submit" disabled={submitting}>
          {submitting ? <><span className="button-spinner" />Creating account…</> : <>Create account <span aria-hidden="true">→</span></>}
        </button>
      </form>
    </AuthLayout>
  );
}
