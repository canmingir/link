import NucleoidLoginForm from "../../components/NucleoidLoginForm";
import SocialLoginButtons from "../../components/SocialLoginButtons";

import { useConfig } from "../../context/ConfigContext";

import React, { useState } from "react";

const handleOAuthLogin = ({ authUrl, clientId, redirectUri, scope }) => {
  window.location.href = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
};

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const config = useConfig();
  return (
    <div style={{ position: "fixed", width: "100%", height: "100%" }}>
      <p>Sign in to your account</p>
      {!!config.login.nucleoid && (
        <>
          <NucleoidLoginForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            // TODO: Add function for login without Oauth 2.0
            onSubmit={() => handleOAuthLogin({ ...config.login.github })}
          />
        </>
      )}

      {config.login.platforms.map((platform) => (
        <SocialLoginButtons
          key={platform.name}
          title={platform.title}
          handleClick={() => handleOAuthLogin({ ...platform.strategy })}
        />
      ))}
    </div>
  );
}

export default LoginForm;
