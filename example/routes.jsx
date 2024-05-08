import {
  CompactLayout,
  DashboardLayout,
  FullScreenLayout,
} from "platform-npm/layouts";

import Index from "./src/pages/index";
import MainPage from "./src/pages/MainPage";
import SecondPage from "./src/pages/SecondPage";

const routes = [
  {
    element: <CompactLayout />,
    children: [{ path: "/", element: <Index /> }],
  },
  {
    element: <FullScreenLayout />,
    children: [{ path: "/main", element: <MainPage /> }],
  },
  {
    element: <DashboardLayout />,
    children: [{ path: "/secondPage", element: <SecondPage /> }],
  },
];

export default routes;
