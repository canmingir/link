import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function AddressItem({ address, action, sx, ...other }) {
  const { name, fullAddress, addressType, phoneNumber, primary } = address;

  return (
    <Stack
      component={Paper}
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      {...other}
      sx={[{
        alignItems: { md: 'flex-end' },
        position: 'relative',
        ...sx
      }, ...(Array.isArray(other.sx) ? other.sx : [other.sx])]}>
      <Stack spacing={1} sx={{
        flexGrow: 1
      }}>
        <Stack direction="row" sx={{
          alignItems: "center"
        }}>
          <Typography variant="subtitle2">
            {name}
            <Box component="span" sx={{ ml: 0.5, typography: 'body2', color: 'text.secondary' }}>
              ({addressType})
            </Box>
          </Typography>

          {primary && (
            <Label color="info" sx={{ ml: 1 }}>
              Default
            </Label>
          )}
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {fullAddress}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {phoneNumber}
        </Typography>
      </Stack>
      {action && action}
    </Stack>
  );
}

AddressItem.propTypes = {
  action: PropTypes.node,
  address: PropTypes.object,
  sx: PropTypes.object,
};
