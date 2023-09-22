import Index from "./src/pages/index";
import MainPage from "./src/pages/MainPage";
import SecondPage from "./src/pages/SecondPage";

const routes = [
  {
    name: "/",
    url: `/`,
    element: Index,
  },
  {
    name: "Main",
    url: `/main`,
    element: MainPage,
  },
  {
    name: "SecondPage",
    url: "/main/secondPage",
    element: SecondPage,
  },
];

export default routes;
