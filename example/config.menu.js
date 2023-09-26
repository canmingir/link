import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HomeFilledIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
const menuConfig = {
  topMenu: [
    { name: "/", url: `/`, hide: true, hideTopBar: false },
    {
      name: "Main",
      url: "/main",
      hide: true,
      hideTopBar: true,
    },
    {
      name: "Main",
      url: "/main",
      hide: true,
      hideTopBar: false,
    },
  ],
  sideMenu: [
    {
      name: "Index",
      url: "/",
      activeIcon: InfoIcon,
      deactiveIcon: InfoOutlinedIcon,
      hideTopBar: false,
    },
    {
      name: "Main",
      url: "/main",
      activeIcon: HomeFilledIcon,
      deactiveIcon: HomeOutlinedIcon,
      hideTopBar: false,
    },
    {
      name: "Second Page",
      url: "/main/secondPage",
      activeIcon: AccessTimeFilledIcon,
      deactiveIcon: AccessTimeIcon,
      hideTopBar: false,
    },
  ],
  topMenuColor: "custom.sidebarBG",
};

export default menuConfig;
