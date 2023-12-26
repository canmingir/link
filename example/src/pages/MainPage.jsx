import { Box, Container, Typography } from "@mui/material";

import Chart from "react-apexcharts";
import NavVertical from "../../../src/layouts/DashboardLayout/nav-vertical";
import WidgetSummary from "../../../components/WidgetSummary";
import { alpha } from "@mui/material/styles";
import { useChart } from "../../../src/components/chart";
import { useTheme } from "@mui/material/styles";

function MainPage() {
  const theme = useTheme();
  const colors = [theme.palette["primary"].main, theme.palette["primary"].dark];

  const chartOptions = {
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "68%",
        borderRadius: 2,
      },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: () => "",
        },
      },
      marker: { show: false },
    },
  };

  const series = [20, 41, 63, 33, 28, 35, 50, 46, 11, 26];

  const Charst = () => {
    return (
      <Chart
        dir="ltr"
        type="bar"
        series={[{ data: series }]}
        options={chartOptions}
        width={60}
        height={36}
      />
    );
  };

  return (
    <>
      <Container>
        <Typography variant="h3">Main</Typography>
        <WidgetSummary
          title="Total Installed"
          percent={0.2}
          total={4876}
          chart={<Charst />}
        />
      </Container>
      <Container>
        <Typography variant="h3">Main</Typography>
        <WidgetSummary
          title="Total Installed"
          percent={0.2}
          total={4876}
          chart={<Charst />}
        />
      </Container>
      <Container>
        <Typography variant="h3">Main</Typography>
        <WidgetSummary
          title="Total Installed"
          percent={0.2}
          total={4876}
          chart={<Charst />}
        />
      </Container>
      <Container>
        <Typography variant="h3">Main</Typography>
        <WidgetSummary
          title="Total Installed"
          percent={0.2}
          total={4876}
          chart={<Charst />}
        />
      </Container>
    </>
  );
}

export default MainPage;
