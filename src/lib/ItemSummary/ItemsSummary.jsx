import React from "react";
import SvgColor from "../SvgColor";

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
      <Grid container sx={{
        mb: 4
      }}>
        <Grid
          sx={{
            justifyContent: "center",
            display: "flex",
          }}
          size={5}>
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
                slotProps={{
                  title: {
                    variant: "subtitle1",
                    textAlign: "center",
                    color: "text.secondary",
                  }
                }}
              />
              <CardContent
                children={
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        mb: 2
                      }}>
                      {newItems[0].details.name}
                    </Typography>
                    <Stack
                      sx={{
                        padding: 1,

                        "& .svg-color": {
                          background: (theme) =>
                            `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        }
                      }}>
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
          sx={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
          }}
          size={2}>
          <Divider orientation="vertical" sx={{ borderStyle: "dashed" }} />
        </Grid>
        <Grid size={5}>
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
                slotProps={{
                  title: {
                    variant: "subtitle1",
                    textAlign: "center",
                    color: "text.secondary",
                  }
                }}
              />
              <CardContent
                children={
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        mb: 2
                      }}>
                      {newItems[1].details.name}
                    </Typography>
                    <Stack
                      sx={{
                        padding: 1,

                        "& .svg-color": {
                          background: (theme) =>
                            `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        }
                      }}>
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
