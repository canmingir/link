const styles = {
  largeButton: {
    height: "25rem",
    width: 340,
    borderRadius: "20px",
    containerWidth: 390,
  },
  wideButton: {
    width: "100%",
    height: "7.1rem",
    minWidth: "290px",
    maxHeight: "116px",
  },
  default: {
    cursor: "pointer",
    boxShadow: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
    transition: "0.3s",
    color: "text.secondary",

    ":hover": {
      bgcolor: "text.secondary",
      color: "background.default",
    },
  },
};

export default styles;
