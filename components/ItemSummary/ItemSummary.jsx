import DialogContentText from "@mui/material/DialogContentText";
import Grid from "@mui/material/Grid";
import { SvgColor } from "@nucleoidai/platform/minimal/components";

import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";

export default function ItemSummary({ newItem }) {
  return (
    <>
      <DialogContentText sx={{ textAlign: "center", mb: 2 }}>
        Summary
      </DialogContentText>
      <Grid container spacing={1} mb={4}>
        <Grid
          item
          xs={newItem.description ? 4 : 12}
          sx={{
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Card
            sx={{
              bgcolor: (theme) => theme.palette.background.paper,
              boxShadow: (theme) => theme.customShadows.card,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <CardContent
              children={
                <>
                  <Typography variant="h6" textAlign={"center"} mb={2}>
                    {newItem.name}
                  </Typography>
                  <Stack
                    sx={{
                      "& .svg-color": {
                        background: (theme) =>
                          `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                      },
                    }}
                  >
                    <SvgColor
                      src={`https://api.iconify.design/${newItem.icon?.slice(
                        1,
                        -1
                      )}.svg`}
                      variant="square"
                      sx={{ width: 82, height: 82 }}
                    />
                  </Stack>
                </>
              }
            />
          </Card>
        </Grid>
        {newItem.description && (
          <Grid item xs={8}>
            <Card sx={{ minHeight: "100%" }}>
              <CardHeader title="Description" />
              <CardContent>
                <Typography>{newItem.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </>
  );
}
