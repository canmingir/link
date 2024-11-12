import {
  CompactLayout,
  DashboardLayout,
  FullScreenLayout,
} from "@nucleoidai/platform/layouts";

import Battles from "./src/pages/Battles";
import Emperor from "./src/pages/Emperor";
import Index from "./src/pages/index";

const routes = [
  {
    element: <CompactLayout />,
    children: [{ path: "/", element: <Index /> }],
  },
  {
    element: <DashboardLayout />,
    children: [{ path: "/emperor", element: <Emperor /> }],
  },
  {
    element: <FullScreenLayout />,
    children: [{ path: "/emperor/battle", element: <Battles /> }],
  },
];

export default routes;
