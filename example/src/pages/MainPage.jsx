import { Box, Container, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Chart, { useChart } from "../../../components";
function MainPage() {
  const series = [44, 55, 13, 10];
  const chartOptions = useChart({
    labels: ["Team A", "Team B", "Team C", "Team D"],
    legend: {
      position: "right",
      offsetX: -20,
      offsetY: 64,
      itemMargin: {
        vertical: 8,
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
  });

  return (
    <Container>
      <Typography variant="h3">Main</Typography>{" "}
      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      />
      <Chart
        dir="ltr"
        type="pie"
        series={series}
        options={chartOptions}
        width={400}
        height="auto"
      />
    </Container>
  );
}

export default MainPage;
