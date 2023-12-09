import Button from "@mui/material/Button";
import { PageNotFoundIllustration } from "../../assets/illustrations";
import { RouterLink } from "../../routes/components";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";

import { MotionContainer, varBounce } from "../../components/animate";

// ----------------------------------------------------------------------

export default function NotFoundView() {
  return (
    <MotionContainer>
      <motion.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Sorry, Page Not Found!
        </Typography>
      </motion.div>

      <motion.div variants={varBounce().in}>
        <Typography sx={{ color: "text.secondary" }}>
          Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
          mistyped the URL? Be sure to check your spelling.
        </Typography>
      </motion.div>

      <motion.div variants={varBounce().in}>
        <PageNotFoundIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
      </motion.div>

      <Button component={RouterLink} href="/" size="large" variant="contained">
        Go to Home
      </Button>
    </MotionContainer>
  );
}
