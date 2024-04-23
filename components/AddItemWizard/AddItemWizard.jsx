import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ItemsSummary from "../ItemSummary/ItemsSummary";
import React from "react";
import SelectAvatar from "../IconSelector/IconSelector";
import SparkleInput from "../SparkleInput/SparkleInput";
import StepComponent from "../StepComponent/StepComponent";

import { Grid, Stack, Switch, Typography } from "@mui/material";
import { publish, useEvent } from "@nucleoidjs/react-event";

function AddItemWizard({ onSubmit, items, steps, stepExp }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [newItems, setNewItems] = React.useState(items);
  const [addNewDialog] = useEvent("ADD_NEW_DIALOG_OPENED", { open: false });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleEmojiSelect = (index) => (emoji) => {
    setNewItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index
          ? {
              ...item,
              details: { ...item.details, icon: emoji.shortcodes },
            }
          : item
      )
    );
  };
  const handleSave = () => {
    onSubmit(newItems);
    publish("ADD_NEW_DIALOG_OPENED", { open: false });
    setActiveStep(0);
  };

  const handleSwitchChange = (index) => (event) => {
    // eslint-disable-next-line no-unused-vars
    const serviceType = !event.target.checked ? "multiple" : "single";
    setNewItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index
          ? {
              ...item,
              details: { ...item.details },
            }
          : item
      )
    );
  };

  const handleInputChange = (index, prop) => (event) => {
    setNewItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index
          ? {
              ...item,
              details: { ...item.details, [prop]: event.target.value },
            }
          : item
      )
    );
  };
  const Project = () => {
    return (
      <Stack
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <SparkleInput
          prop="name"
          value={newItems[0].details.name}
          onChange={handleInputChange(0, "name")}
          sparkle={false}
        />
        <Typography variant="subtitle1" color={"gray"}>
          Select an Icon
        </Typography>
        <SelectAvatar
          handleEmojiSelect={handleEmojiSelect(0)}
          iconCategories={"project_icons"}
          avatar={newItems[0].details.icon?.replace(/:/g, "").replace("/", ":")}
        />
        <Typography variant="subtitle1" color={"gray"} sx={{ mb: -2 }}>
          Service Type
        </Typography>
        <Stack direction="row" alignItems="center">
          <Typography>Single</Typography>
          <Switch defaultChecked onChange={handleSwitchChange(0)} />
          <Typography>Multiple</Typography>
        </Stack>
      </Stack>
    );
  };

  const Service = () => {
    return (
      <Grid container justifyContent="center" mt={1} spacing={2}>
        <Grid item xs={5}>
          <Stack
            sx={{
              borderStyle: "none dotted none none",
              borderWidth: 2,
              padding: 2,
              borderColor: (theme) => theme.palette.divider,
            }}
          >
            <SparkleInput
              prop="name"
              value={newItems[1].details.name}
              onChange={handleInputChange(1, "name")}
              sparkle={false}
            />
            <Typography
              variant="subtitle1"
              color={"gray"}
              textAlign={"center"}
              sx={{ marginTop: 2, marginBottom: 1 }}
            >
              Select an Icon
            </Typography>
            <SelectAvatar
              handleEmojiSelect={handleEmojiSelect(1)}
              iconCategories={"service_icons"}
              avatar={newItems[1]?.details.icon
                ?.replace(/:/g, "")
                .replace("/", ":")}
            />
          </Stack>
        </Grid>
        <Grid item xs={7}>
          <SparkleInput
            prop="description"
            value={newItems[1].details.description}
            onChange={handleInputChange(1, "description")}
            multiline
            rows={11}
          />
        </Grid>
      </Grid>
    );
  };
  const Summary = () => {
    return <ItemsSummary newItems={newItems} />;
  };

  const StepPages = () => {
    switch (activeStep) {
      case 0:
        return Project();
      case 1:
        return Service();
      case 2:
        return <Summary />;
    }
  };
  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={addNewDialog.open}
      onClose={() => {
        publish("ADD_NEW_DIALOG_OPENED", { open: false });
        setActiveStep(0);
      }}
    >
      <>
        <DialogTitle
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
          }}
        ></DialogTitle>
        <StepComponent
          activeStep={activeStep}
          steps={steps}
          stepExp={stepExp}
          handleNext={handleNext}
          handleBack={handleBack}
          handleSave={handleSave}
        >
          <DialogContent
            sx={{
              height: "100%",
              alignContent: "center",
              justifyContent: "center",
              backgroundColor: (theme) => theme.palette.background.default,
            }}
          >
            {StepPages()}
          </DialogContent>
        </StepComponent>
      </>
    </Dialog>
  );
}

export default AddItemWizard;
