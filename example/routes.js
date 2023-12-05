import CompactLayout from "../src/layouts/CompactLayout";
import Dashboard from "../src/layouts/dashboard";
import Index from "./src/pages/index";
import Main from "../src/layouts/main";
import MainPage from "./src/pages/MainPage";
import SecondPage from "./src/pages/SecondPage";
const routes = [
  {
    element: CompactLayout,
    children: [{ path: "/", element: Index }],
  },
  {
    element: Dashboard,
    children: [{ path: "/main", element: MainPage }],
  },
  {
    element: Main,
    children: [{ path: "/secondPage", element: SecondPage }],
  },
];

export default routes;
