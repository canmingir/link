import type { RefObject } from "react";
import { forwardRef } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface DeleteResourceInfo {
  deleteAdress?: string;
  deleteList: string[];
}

interface DeleteResourceDialogProps {
  open?: boolean;
  setOpen: (open: boolean) => void;
  deleteResource: () => void;
}

const DeleteResourceDialog = forwardRef<
  DeleteResourceInfo,
  DeleteResourceDialogProps
>(({ setOpen, deleteResource }, ref) => {
  const resource = (ref as RefObject<DeleteResourceInfo>)?.current;

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
        {(resource?.deleteList.length ?? 0) > 0 && (
          <>
            <Typography sx={{ mt: 2 }}>
              The following child resources will also be deleted:
            </Typography>
            {resource?.deleteList.map((item: string, index: number) => (
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
