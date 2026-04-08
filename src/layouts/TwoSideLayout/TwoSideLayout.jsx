import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import React from "react";
import Typography from "@mui/material/Typography";
// ----------------------------------------------------------------------

export default function TwoSideLayout({ rows, title }) {
  const rowData = rows;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        {title}
      </Typography>
      {Object.values(rowData).map((array, index) => {
        const eleman_sayisi = array.length;
        const grid_sayisi = 12 / eleman_sayisi;
        return (
          <Grid container spacing={3} key={index}>
            {array.map((component, i) => (
              <Grid
                key={i}
                size={{
                  xs: 12,
                  sm: 6,
                  md: grid_sayisi,
                }}
              >
                {component}
              </Grid>
            ))}
          </Grid>
        );
      })}
    </Container>
  );
}
