import ReactMarkdown from "react-markdown";
import { Box, CircularProgress, Typography } from "@mui/material";

const ViewPanel = ({
  height,
  content,
  loading,
  title = "LOGIC.md",
}: {
  height?: number | string;
  content?: string;
  loading?: boolean;
  rounded?: boolean;
  title?: string;
}) => {
  return (
    <Box
      sx={{
        mb: 1,
        height: height || "calc(100vh - 48px)",
        display: "flex",
        flexDirection: "column",
        borderRadius: "1px",
        overflow: "hidden",
        bgcolor: "#000000",
        flexShrink: 0,
        px: 2,
        py: 2,
      }}
    >
      <Box
        sx={{
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Box
          sx={{
            p: 1,
            borderBottom: "0.5px solid rgba(255,255,255,0.08)",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              color: "#e3e3e3",
              fontWeight: 500,
              fontSize: "0.95rem",
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            pl: "35px",
            pr: 2,
            pt: 1,
            pb: 1,
            "& code": {
              bgcolor: "rgba(255,255,255,0.1)",
              px: 0.5,
              borderRadius: 0.5,
            },
            "& p:first-of-type": { mt: 0 },
            "& h1:first-of-type, & h2:first-of-type, & h3:first-of-type": {
              mt: 0,
            },
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255,255,255,0.1)",
              borderRadius: 2,
            },
          }}
        >
          {loading && !content ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#a1a1aa",
                fontSize: "0.85rem",
                py: 1,
              }}
            >
              <CircularProgress size={14} sx={{ color: "#a1a1aa" }} />
              Generating…
            </Box>
          ) : content ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            <Box sx={{ height: "1.2em" }} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ViewPanel;
