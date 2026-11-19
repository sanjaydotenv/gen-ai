import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../components/AuthLayout.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { clearAuthError, loginUser } from "../store/slices/authSlice.js";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { submitting, error: reduxError, fieldErrors } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: "" });
    dispatch(clearAuthError());
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.password) nextErrors.password = "Enter your password.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const result = await dispatch(loginUser({
      email: form.email.trim(),
      password: form.password,
    }));
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your space"
      description="Pick up right where you left off."
      footer={<>New to Northstar? <Link to="/register">Create an account</Link></>}
    >
      <form className="auth-form" onSubmit={submit} noValidate>
        {(reduxError || fieldErrors.email || fieldErrors.password) && (
          <div className="form-alert" role="alert">
            {reduxError || "Please check the information you entered."}
          </div>
        )}
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
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password || fieldErrors.password?.[0]}
        />
        <button className="submit-button" type="submit" disabled={submitting}>
          {submitting ? <><span className="button-spinner" />Signing in…</> : <>Sign in <span aria-hidden="true">→</span></>}
        </button>
      </form>
    </AuthLayout>
  );
}
