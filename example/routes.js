import Index from "./src/pages/index";
import MainPage from "./src/pages/MainPage";

const routes = [
  { name: "/", url: `/`, element: Index },
  { name: "Main", url: `/main`, element: MainPage },
];

export default routes;
