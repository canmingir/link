import { Button } from "@mui/material";
import React from "react";
import styles from "../../widgets/LoginForm/LoginFormStyles";

import { GitHub, Google, LinkedIn } from "@mui/icons-material";

export default function SocialLoginButtons({ handleClick, title }) {
  return (
    <>
      {title == "Github" && (
        <Button
          startIcon={<GitHub />}
          variant="contained"
          color="primary"
          sx={styles.githubButtonStyle}
          onClick={handleClick}
        >
          Continue with GitHub
        </Button>
      )}

      {title == "Google" && (
        <Button
          startIcon={<Google style={{ color: "#DB4437" }} />}
          variant="contained"
          color="primary"
          sx={styles.googleButtonStyle}
          onClick={handleClick}
        >
          Continue with Google
        </Button>
      )}
      {title == "Linkedin" && (
        <Button
          startIcon={<LinkedIn />}
          variant="contained"
          sx={styles.linkedinButtonStyle}
          onClick={handleClick}
        >
          Continue with LinkedIn
        </Button>
      )}
    </>
  );
}
