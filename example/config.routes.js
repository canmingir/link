import Index from "./src/pages/index";
import MainPage from "./src/pages/MainPage";
import SecondPage from "./src/pages/SecondPage";

const routes = [
  {
    title: "root",
    name: "/",
    url: `/`,
    element: Index,
  },
  {
    title: "anasayfa",
    name: "Main",
    url: `/main`,
    element: MainPage,
  },
  {
    title: "ikinci sayfa",
    name: "SecondPage",
    url: "/main/secondPage",
    element: SecondPage,
  },
];

export default routes;
