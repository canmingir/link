import React from "react";

const NucleoidLoginForm = ({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
}) => (
  <div>
    <input
      type="text"
      label="Email"
      size="small"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      type="text"
      required
      label="Password"
      size="small"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button onClick={() => onSubmit()}>Sign In</button>
  </div>
);

export default NucleoidLoginForm;
