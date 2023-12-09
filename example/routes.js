import { CompactLayout } from "../src/layouts";
import { DashboardLayout } from "../src/layouts";
import Index from "./src/pages/index";
import { MainLayout } from "../src/layouts";
import MainPage from "./src/pages/MainPage";
import SecondPage from "./src/pages/SecondPage";
const routes = [
  {
    element: CompactLayout,
    children: [{ path: "/", element: Index }],
  },
  {
    element: DashboardLayout,
    children: [{ path: "/main", element: MainPage }],
  },
  {
    element: MainLayout,
    children: [{ path: "/secondPage", element: SecondPage }],
  },
];

export default routes;
