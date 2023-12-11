import Container from "@mui/material/Container";
import Header from "../common/header-simple";
import { Outlet } from "react-router";
import Stack from "@mui/material/Stack";
import React from "react";

// ----------------------------------------------------------------------

const CompactLayout = () => {
  return (
    <>
      <Header />

      <Container component="main">
        <Stack
          sx={{
            py: 12,
            m: "auto",
            maxWidth: 400,
            minHeight: "100vh",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <Outlet />
        </Stack>
      </Container>
    </>
  );
};

export default CompactLayout;
