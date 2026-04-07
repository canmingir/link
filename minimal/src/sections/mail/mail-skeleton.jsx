import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

export function MailNavItemSkeleton({ sx, ...other }) {
  return (
    <Stack
      spacing={2}
      direction="row"
      {...other}
      sx={[{
        alignItems: "center",
        py: 1,
        color: (theme) => alpha(theme.palette.grey[500], 0.24),
        ...sx
      }, ...(Array.isArray(other.sx) ? other.sx : [other.sx])]}>
      <Skeleton variant="circular" sx={{ width: 32, height: 32, bgcolor: 'currentColor' }} />
      <Skeleton sx={{ width: 0.5, height: 10, bgcolor: 'currentColor' }} />
    </Stack>
  );
}

MailNavItemSkeleton.propTypes = {
  sx: PropTypes.object,
};

// ----------------------------------------------------------------------

export function MailItemSkeleton({ sx, ...other }) {
  return (
    <Stack
      spacing={2}
      direction="row"
      {...other}
      sx={[{
        alignItems: "center",
        py: 1,
        ...sx
      }, ...(Array.isArray(other.sx) ? other.sx : [other.sx])]}>
      <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
      <Stack spacing={1} sx={{
        flexGrow: 1
      }}>
        <Skeleton sx={{ width: 0.75, height: 10 }} />
        <Skeleton sx={{ width: 0.5, height: 10 }} />
      </Stack>
    </Stack>
  );
}

MailItemSkeleton.propTypes = {
  sx: PropTypes.object,
};
