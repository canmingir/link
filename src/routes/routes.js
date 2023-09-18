import Address from "../pages/address";
import Chat from "../pages/chat";
import Colleague from "../pages/colleague";
import Colleagues from "../pages/colleagues";
import Index from "../pages/index";
import Teams from "../pages/teams";
import config from "../../config";

const routes = [
  { name: "/", url: `/`, element: Index, show: true, hide: true },
  { name: "Address", url: `/address`, element: Address },
  { name: "Teams", url: `/teams`, element: Teams },
  { name: "Chat", url: `/teams/chat`, element: Chat },
  {
    name: "Colleagues",
    url: `/teams/colleagues`,
    element: Colleagues,
  },
  {
    name: "Colleague",
    url: `/colleagues/:colleagueId`,
    element: Colleague,
  },
].filter((route) =>
  config.topMenu.find((configRoute) => configRoute.url === route.url)
);

export default routes;
