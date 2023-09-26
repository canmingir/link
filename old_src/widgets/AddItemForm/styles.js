const styles = {
  dialogTitle: {
    bgcolor: "primary.main",
    color: "background.default",
    py: "1rem",
    px: "2rem",
    textTransform: "capitalize",
  },
  dialogContent: {
    backgroundColor: "background.paper",
    color: "primary.main",
    px: "2rem",
    py: "1rem",
  },
  textField: {
    mt: "1rem",
  },
  dialogActions: {
    pr: "2rem",
    pb: "1rem",
    backgroundColor: "background.paper",
    color: "background.default",
  },
  cancelButton: {
    textTransform: "capitalize",
  },
  saveButton: {
    textTransform: "capitalize",
    ml: "1rem",
  },
  iconTitle: { marginTop: "20px", textTransform: "capitalize" },
  iconDivider: {
    backgroundColor: "primary.main",
    height: "0.4px",
  },
  iconBox: {
    flexDirection: "row",
    display: "flex",
    marginTop: "30px",
    justifyContent: "center",
    alignItems: "center",
  },
  iconPreview: {
    backgroundColor: "primary.main",
    display: "flex",
    justifyContent: "center",
    height: "170px",
    width: "170px",
    marginRight: "30px",
    padding: "40px",
    borderRadius: "30px",
    flexDirection: "column",
    alignContent: "center",
  },
  iconName: {
    textAlign: "center",
    marginTop: "10px",
    color: "text.secondary",
    fontSize: "20px",
    textTransform: "capitalize",
  },
  iconButton: {
    color: "primary.main",
    flexDirection: "column",
    width: "30%",
    height: "100%",
    fontSize: "12px",
  },
};

export default styles;
