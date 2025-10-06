import { useEffect, useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ItemSummary from "./ItemSummary/ItemSummary";
import React from "react";
import SelectAvatar from "./IconSelector/IconSelector";
import SparkleInput from "./SparkleInput/SparkleInput";
import StepComponent from "./StepComponent/StepComponent";

function ProjectWizard({
  itemProperties,
  onSubmit,
  open,
  onClose,
  itemToEdit,
  steps,
  stepExp,
}) {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [newItem, setNewItem] = useState(
    itemProperties.reduce((obj, property) => ({ ...obj, [property]: "" }), {})
  );

  useEffect(() => {
    if (itemToEdit) {
      setNewItem(itemToEdit);
    } else if (!open) {
      setNewItem(
        itemProperties.reduce(
          (obj, property) => ({ ...obj, [property]: "" }),
          {}
        )
      );
    }
  }, [open, itemProperties, itemToEdit]);

  const handleSave = () => {
    if (newItem.id) {
      const { id, ...rest } = newItem;
      onSubmit(id, rest);
    } else {
      onSubmit(newItem);
    }
    onClose();
    setActiveStep(0);
  };

  const handleEmojiSelect = (emoji) => {
    setNewItem((prevItem) => {
      return {
        ...prevItem,
        icon: emoji.shortcodes,
      };
    });
  };
  const handleInputChange = (property) => (event) => {
    setNewItem({ ...newItem, [property]: event.target.value });
  };

  const Name = () => {
    return (
      <SparkleInput
        prop="name"
        value={newItem["name"]}
        onChange={handleInputChange("name")}
      />
    );
  };

  const StepPages = () => {
    switch (activeStep) {
      case 0:
        return Name();
      case 1:
        return (
          <SelectAvatar
            handleEmojiSelect={handleEmojiSelect}
            iconCategories={"project_icons"}
            avatar={newItem?.icon?.replace(/:/g, "").replace("/", ":")}
          />
        );
      case 2:
        return <ItemSummary newItem={newItem} />;
    }
  };
  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={open}
      onClose={() => {
        onClose();
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

export default ProjectWizard;
