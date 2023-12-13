import Container from "@mui/material/Container";
import Header from "../common/header-simple";
import { Outlet } from "react-router";
import React from "react";
import Stack from "@mui/material/Stack";

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
