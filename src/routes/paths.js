// ----------------------------------------------------------------------

const ROOTS = {
  DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: "https://mui.com/store/items/minimal-dashboard/",

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/one`,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },
};
