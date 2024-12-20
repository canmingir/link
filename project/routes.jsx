import {
  CompactLayout,
  DashboardLayout,
  FullScreenLayout,
} from "@nucleoidai/platform/layouts";

import Battles from "./src/pages/Battles";
import Container from "./src/Container";
import Emperor from "./src/pages/Emperor";
import Index from "./src/pages/index";

const routes = [
  {
    container: <Container />,
    childs: [
      {
        layout: <CompactLayout />,
        pages: [
          {
            path: "/",
            element: <Index />,
          },
        ],
      },
      {
        layout: <DashboardLayout />,
        pages: [
          {
            path: "/emperor",
            element: <Emperor />,
          },
        ],
      },
      {
        layout: <FullScreenLayout />,
        pages: [
          {
            path: "/emperor/battle",
            element: <Battles />,
          },
        ],
      },
    ],
  },
];

export default routes;
