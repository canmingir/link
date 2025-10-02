import { SvgColor } from "../SvgColor";

import {
  Card,
  CardContent,
  CardHeader,
  DialogContentText,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function ItemsSummary({ newItems }) {
  return (
    <>
      <DialogContentText sx={{ textAlign: "center", mb: 2 }}>
        Summary
      </DialogContentText>
      <Grid container mb={4}>
        <Grid
          item
          xs={5}
          sx={{
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Stack
            sx={{
              height: "100%",
              justifyContent: "center",
              alignContent: "center",
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
              <CardHeader
                title={"Project Summary"}
                titleTypographyProps={{
                  variant: "subtitle1",
                  textAlign: "center",
                  color: "text.secondary",
                }}
              />
              <CardContent
                children={
                  <>
                    <Typography variant="h6" textAlign={"center"} mb={2}>
                      {newItems[0].details.name}
                    </Typography>
                    <Stack
                      padding={1}
                      sx={{
                        "& .svg-color": {
                          background: (theme) =>
                            `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        },
                      }}
                    >
                      <SvgColor
                        src={`https://api.iconify.design/${newItems[0].details.icon?.slice(
                          1,
                          -1
                        )}.svg`}
                        variant="square"
                        sx={{
                          width: 82,
                          height: 82,
                          alignSelf: "center",
                          justifySelf: "center",
                        }}
                      />
                    </Stack>
                  </>
                }
              />
            </Card>
          </Stack>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Divider orientation="vertical" sx={{ borderStyle: "dashed" }} />
        </Grid>
        <Grid item xs={5}>
          <Stack
            sx={{
              height: "100%",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Card>
              <CardHeader
                title={"Service Summary"}
                titleTypographyProps={{
                  variant: "subtitle1",
                  textAlign: "center",
                  color: "text.secondary",
                }}
              />
              <CardContent
                children={
                  <>
                    <Typography variant="h6" textAlign={"center"} mb={2}>
                      {newItems[1].details.name}
                    </Typography>
                    <Stack
                      padding={1}
                      sx={{
                        "& .svg-color": {
                          background: (theme) =>
                            `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        },
                      }}
                    >
                      <SvgColor
                        src={`https://api.iconify.design/${newItems[1].details.icon?.slice(
                          1,
                          -1
                        )}.svg`}
                        variant="square"
                        sx={{
                          width: 82,
                          height: 82,
                          alignSelf: "center",
                          justifySelf: "center",
                          mb: 2,
                        }}
                      />
                      <TextField
                        value={newItems[1].details.description}
                        variant="outlined"
                        label="Description"
                        fullWidth={true}
                        multiline
                        rows={3}
                      />
                    </Stack>
                  </>
                }
              />
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
