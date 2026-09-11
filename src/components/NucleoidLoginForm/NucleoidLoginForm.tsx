import styles from "../../widgets/LoginForm/LoginFormStyles";

import { Box, Button, Link as MuiLink, TextField } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";

interface NucleoidLoginFormProps {
  email: string;
  password: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  onSubmit: (email: string, password: string) => void;
}

const NucleoidLoginForm = ({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
}: NucleoidLoginFormProps) => (
  <Box
    component="form"
    sx={styles.formBoxStyle}
    noValidate
    autoComplete="off"
    onSubmit={(e) => {
      e.preventDefault();
      if (typeof onSubmit === "function") {
        onSubmit(email, password);
      }
    }}
  >
    <TextField
      required
      type="email"
      label="Email"
      variant="outlined"
      sx={{ margin: "1rem 0 0", width: "100%" }}
      size="small"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <TextField
      required
      label="Password"
      type="password"
      variant="outlined"
      sx={{ margin: "1rem 0 1rem", width: "100%" }}
      size="small"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <MuiLink
      href="/console/login2"
      variant="body2"
      sx={{
        textDecoration: "none",
        alignSelf: "center",
        justifySelf: "center",
      }}
    >
      Forgot Password?
    </MuiLink>

    <Button
      variant="contained"
      color="primary"
      sx={styles.signInButtonStyle}
      type="submit"
    >
      Sign In
    </Button>
  </Box>
);

export default NucleoidLoginForm;
