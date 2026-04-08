import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function MailHeader({ onOpenNav, onOpenMail, ...other }) {
  return (
    <Stack
      spacing={2}
      direction="row"
      {...other}
      sx={[{
        alignItems: "center",
        py: 1
      }, ...(Array.isArray(other.sx) ? other.sx : [other.sx])]}>
      <Stack direction="row" sx={{
        alignItems: "center"
      }}>
        <IconButton onClick={onOpenNav}>
          <Iconify icon="fluent:mail-24-filled" />
        </IconButton>

        {onOpenMail && (
          <IconButton onClick={onOpenMail}>
            <Iconify icon="solar:chat-round-dots-bold" />
          </IconButton>
        )}
      </Stack>
      <TextField
        fullWidth
        size="small"
        placeholder="Search..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }
        }}
      />
    </Stack>
  );
}

MailHeader.propTypes = {
  onOpenMail: PropTypes.func,
  onOpenNav: PropTypes.func,
};
