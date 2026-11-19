import { useState } from "react";

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = "At least 8 characters",
  autoComplete,
  error,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={`input-wrap ${error ? "input-invalid" : ""}`}>
        <span className="input-icon" aria-hidden="true">⌑</span>
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          className="visibility-toggle"
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {error && <span className="field-error" id={`${id}-error`}>{error}</span>}
    </div>
  );
}
