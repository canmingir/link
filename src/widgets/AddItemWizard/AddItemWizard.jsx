import AppsIcon from "@mui/icons-material/Apps";
import Picker from "@emoji-mart/react";
import TeamIcons from "../../lib/TeamIcons";
import data from "@emoji-mart/data";
import styles from "./styles";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

function AddItemWizard({ title, itemProperties, onSubmit, open, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [validInput, setValidInput] = useState(false);
  const [newItems, setNewItems] = useState(() =>
    itemProperties.map(({ fields }) =>
      fields.reduce((obj, property) => ({ ...obj, [property]: "" }))
    )
  );
  const [emojiDialogOpen, setEmojiDialogOpen] = useState(false);

  const isLastStep = currentIndex === itemProperties.length - 1;

  const handleEmojiSelect = (emoji) => {
    setNewItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[currentIndex]["icon"] = `:${emoji.id}:`;
      updatedItems[currentIndex]["src"] = `${emoji.src}`;
      return updatedItems;
    });
    setEmojiDialogOpen(false);
  };
  const handleEmojiButtonClick = () => {
    setEmojiDialogOpen(true);
  };

  useEffect(() => {
    if (!open) {
      setCurrentIndex(0);
      setNewItems(
        itemProperties.map(({ fields }) =>
          fields.reduce((obj, property) => ({ ...obj, [property]: "" }), {})
        )
      );
      setValidInput(false);
    }
  }, [open, itemProperties]);

  const handleNext = () => {
    if (currentIndex < itemProperties.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const handleInputChange = (property) => (event) => {
    setValidInput(event.target.value.trim() !== "");
    setNewItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[currentIndex][property] = event.target.value;
      return updatedItems;
    });
  };

  const handleAction = () => {
    if (isLastStep) {
      onSubmit(newItems);
      onClose();
    } else {
      handleNext();
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: "25px" } }}
    >
      <DialogTitle sx={styles.dialogTitle}>Create a New {title}</DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <Stepper sx={styles.stepper} activeStep={currentIndex} alternativeLabel>
          {itemProperties.map(({ title }, index) => (
            <Step key={index}>
              <StepLabel>{title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {itemProperties[currentIndex].fields.map((property) => (
          <div key={property}>
            {property === "icon" ? (
              <>
                <Typography sx={styles.propertyTitle}>{property}</Typography>
                <Divider sx={styles.iconDivider} />
                <Box sx={styles.iconBox}>
                  <Box sx={styles.iconPreview}>
                    <Box
                      component={"img"}
                      key={property}
                      src={newItems[currentIndex].src}
                    />
                    <Typography sx={styles.iconName}>
                      {newItems[currentIndex].icon.replace(/:/g, "")}
                    </Typography>
                  </Box>

                  <Button
                    onClick={handleEmojiButtonClick}
                    variant="contained"
                    color="secondary"
                    sx={styles.iconButton}
                  >
                    <AppsIcon />
                    Pick Icon
                  </Button>
                  <Dialog open={emojiDialogOpen}>
                    <Picker
                      data={data}
                      onEmojiSelect={handleEmojiSelect}
                      custom={TeamIcons}
                      categories={"team_icons"}
                      categoryIcons={{
                        team_icons: { src: `./media/logo.png` },
                      }}
                      emojiButtonSize={90}
                      emojiSize={75}
                      perLine={4}
                      previewPosition={"none"}
                      searchPosition={"none"}
                      theme={"light"}
                    />
                  </Dialog>
                </Box>
              </>
            ) : (
              <TextField
                autoFocus
                margin="dense"
                label={property}
                fullWidth
                value={newItems[currentIndex][property] || ""}
                onChange={handleInputChange(property)}
                InputLabelProps={{ sx: { color: "primary.main" } }}
                sx={styles.textField}
              />
            )}
          </div>
        ))}
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        {currentIndex === 1 && (
          <Button
            size="small"
            onClick={handleBack}
            color={"secondary"}
            sx={{ marginRight: "100px" }}
          >
            Back
          </Button>
        )}
        <Button
          size="small"
          onClick={handleAction}
          disabled={!validInput}
          color={"secondary"}
          variant="contained"
        >
          {isLastStep ? "Save" : "Next"}
        </Button>
        <Button onClick={onClose} sx={styles.cancelButton}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddItemWizard;
