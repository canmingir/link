import NucleoidLoginForm from "../../components/NucleoidLoginForm";
import SocialLoginButtons from "../../components/SocialLoginButtons";
import Stack from "@mui/material/Stack";
import config from "../../config/config";

import { Box, Divider, Link as MuiLink, Typography } from "@mui/material";
import React, { useState } from "react";

const handleOAuthLogin = (
  { redirectUri, authUrl, clientId, scope },
  identityProvider
) => {
  const state = JSON.stringify({
    identityProvider: identityProvider,
  });
  const encodedState = encodeURIComponent(state);
  window.location.href = `${authUrl}?client_id=${clientId}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}&state=${encodedState}`;
};

function LoginForm() {
  const { name, project } = config();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in to {name}</Typography>
      {project.nucleoid && (
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">New user?</Typography>

          <MuiLink variant="subtitle2">Create an account</MuiLink>
        </Stack>
      )}
    </Stack>
  );

  const renderForm = (
    <>
      {!!project.nucleoid && (
        <>
          <NucleoidLoginForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            // TODO: Add function for login without Oauth 2.0
            onSubmit={() => handleOAuthLogin(config.login.nucleoid)}
          />
          <Typography
            variant="body2"
            sx={{ width: "100%", textAlign: "center" }}
          >
            Don&apos;t have an account ?
            <MuiLink
              href="/console/login2"
              variant="body2"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              Sign Up Now
            </MuiLink>
          </Typography>

          <Divider sx={{ width: "100%", margin: "1rem 0" }}>
            <Box sx={{ px: 2 }}>or</Box>
          </Divider>
        </>
      )}
      <SocialLoginButtons
        googleEnable={!!project.GOOGLE}
        onGoogle={() => handleOAuthLogin({ ...project.GOOGLE }, "google")}
        githubEnable={!!project.GITHUB}
        onGithub={() => handleOAuthLogin({ ...project.GITHUB }, "github")}
        linkedinEnable={!!project.LINKEDIN}
        onLinkedin={() => handleOAuthLogin({ ...project.LINKEDIN }, "linkedin")}
      />
    </>
  );

  return (
    <>
      {renderHead} {renderForm}
    </>
  );
}
export default LoginForm;
