import { forwardRef } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const DeleteResourceDialog = forwardRef(({ setOpen, deleteResource }, ref) => {
  const resource = ref.current;

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteResource();
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Delete resource</DialogTitle>
      <DialogContent>
        <Typography>
          {`The selected resource "${resource?.deleteAdress}" will be deleted.`}
        </Typography>
        {resource?.deleteList.length > 0 && (
          <>
            <Typography sx={{ mt: 2 }}>
              The following child resources will also be deleted:
            </Typography>
            {resource?.deleteList.map((item, index) => (
              <Typography key={index} sx={{ ml: 2 }}>
                - {item}
              </Typography>
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          autoFocus
          data-cy="delete-resource-confirm-button"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default DeleteResourceDialog;
