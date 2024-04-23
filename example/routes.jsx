import { CompactLayout } from "../src/layouts";
import { DashboardLayout } from "../src/layouts";
import { FullScreenLayout } from "../src/layouts";
import Index from "./src/pages/index";
import MainPage from "./src/pages/MainPage";
import SecondPage from "./src/pages/SecondPage";
import { SimpleLayout } from "../src/layouts";

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
