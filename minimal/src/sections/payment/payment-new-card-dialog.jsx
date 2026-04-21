import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function PaymentNewCardDialog({ onClose, ...other }) {
  const popover = usePopover();

  return (
    <>
      <Dialog maxWidth="sm" onClose={onClose} {...other}>
        <DialogTitle> New Card </DialogTitle>

        <DialogContent sx={{ overflow: 'unset' }}>
          <Stack spacing={2.5}>
            <TextField
              autoFocus
              label="Card Number"
              placeholder="XXXX XXXX XXXX XXXX"
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />

            <TextField
              label="Card Holder"
              placeholder="JOHN DOE"
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />

            <Stack spacing={2} direction="row">
              <TextField
                label="Expiration Date"
                placeholder="MM/YY"
                slotProps={{
                  inputLabel: { shrink: true }
                }}
              />
              <TextField
                label="CVV/CVC"
                placeholder="***"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" edge="end" onClick={popover.onOpen}>
                          <Iconify icon="eva:info-outline" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },

                  inputLabel: { shrink: true }
                }} />
            </Stack>

            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                typography: 'caption',
                color: 'text.disabled'
              }}>
              <Iconify icon="carbon:locked" sx={{ mr: 0.5 }} />
              Your transaction is secured with SSL encryption
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="contained" onClick={onClose}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ maxWidth: 200, typography: 'body2', textAlign: 'center' }}
      >
        Three-digit number on the back of your VISA card
      </CustomPopover>
    </>
  );
}

PaymentNewCardDialog.propTypes = {
  onClose: PropTypes.func,
};
