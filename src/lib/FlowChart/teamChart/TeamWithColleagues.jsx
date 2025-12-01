import ColleagueNode from "./common/ColleagueNode";
import ConnectorSVG from "../taskChart/ConnectorSvg";
import EditIcon from "@mui/icons-material/Edit";
import { Iconify } from "@canmingir/link/platform/components";
import ManagerNode from "./common/ManagerNode";
import ResponsibilityNode from "./common/ResponsibilityNode";
import TeamNode from "./common/TeamNode";
import WorkIcon from "@mui/icons-material/Work";
import { useNavigate } from "react-router-dom";

import { Box, Fab, Stack } from "@mui/material";
import React, { useRef } from "react";

function TeamWithColleagues({
  data,
  sx,
  allResponsibilities,
  teamRefs,
  colleagueRefs,
  responsibilityRefs,
  onAddColleague,
  handleDrawerOpen,
  connectorStyle,
}) {
  const manager = {
    name: "Jack Shepherd",
    role: "CAO - Chief AI Officer",
    avatar: ":5:",
    id: "manager-root",
  };

  let navigate;
  try {
    navigate = useNavigate();
  } catch {
    navigate = () => {};
  }

  const localTeamRefs = useRef({});
  const localColleagueRefs = useRef({});
  const localResponsibilityRefs = useRef({});

  const safeTeamRefs = teamRefs || localTeamRefs;
  const safeColleagueRefs = colleagueRefs || localColleagueRefs;
  const safeResponsibilityRefs = responsibilityRefs || localResponsibilityRefs;

  const hasHandleDrawer = typeof handleDrawerOpen === "function";
  const hasAddColleague = typeof onAddColleague === "function";

  const containerRef = useRef(null);
  const managerRef = useRef(null);
  const teamRef = useRef(null);
  const colleagueEls = useRef({});
  const responsibilityEls = useRef({});

  const {
    lineColor = "#D0D7E2",
    lineWidth = 1.5,
    lineStyle = "solid",
    connectorType = "curved",
  } = connectorStyle || {};

  const strokeWidth =
    typeof lineWidth === "number" && !Number.isNaN(lineWidth) ? lineWidth : 1.5;

  const dashStyle =
    lineStyle === "dashed" || lineStyle === "dotted" ? lineStyle : "solid";

  const colleagueElList = Object.values(colleagueEls.current).filter(Boolean);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        display: "inline-block",
      }}
    >
      {data && (
        <>
          {managerRef.current && teamRef.current && (
            <ConnectorSVG
              containerEl={containerRef.current}
              parentEl={managerRef.current}
              childEls={[teamRef.current]}
              stroke={lineColor}
              strokeWidth={strokeWidth}
              lineStyle={dashStyle}
              connectorType={connectorType}
            />
          )}

          {teamRef.current && colleagueElList.length > 0 && (
            <ConnectorSVG
              containerEl={containerRef.current}
              parentEl={teamRef.current}
              childEls={colleagueElList}
              stroke={lineColor}
              strokeWidth={strokeWidth}
              lineStyle={dashStyle}
              connectorType={connectorType}
            />
          )}

          {Object.entries(colleagueEls.current).map(
            ([colleagueKey, parentEl]) => {
              if (!parentEl) return null;
              const children = (
                responsibilityEls.current[colleagueKey] || []
              ).filter(Boolean);
              if (!children.length) return null;

              return (
                <ConnectorSVG
                  key={`resp-lines-${colleagueKey}`}
                  containerEl={containerRef.current}
                  parentEl={parentEl}
                  childEls={children}
                  stroke={lineColor}
                  strokeWidth={strokeWidth}
                  lineStyle={dashStyle}
                  connectorType={connectorType}
                />
              );
            }
          )}
        </>
      )}

      <Stack alignItems="center" spacing={8}>
        {data && (
          <Box ref={managerRef}>
            <ManagerNode sx={sx} node={manager} />
          </Box>
        )}

        <Box position="relative">
          <Box
            ref={(el) => {
              if (safeTeamRefs.current) {
                safeTeamRefs.current[data.id] = el;
              }
              if (el) {
                teamRef.current = el;
              }
            }}
          >
            <TeamNode node={data} sx={sx} />
          </Box>

          {hasAddColleague && (
            <Fab
              color="default"
              aria-label="add colleague"
              data-cy="add-colleague-button"
              size="small"
              onClick={onAddColleague}
              sx={{
                width: 32,
                height: 32,
                minHeight: "auto",
                boxShadow: 2,
                position: "absolute",
                top: "50%",
                right: -40,
                transform: "translateY(-50%)",
              }}
            >
              <Iconify icon="ri:user-add-line" />
            </Fab>
          )}
        </Box>

        {data.colleagues && data.colleagues.length > 0 && (
          <Stack direction="row" spacing={5} justifyContent="center">
            {data.colleagues.map((colleague, index) => {
              const colleagueResponsibilities =
                allResponsibilities?.filter(
                  (resp) => resp.colleagueId === colleague.id
                ) || [];

              const colleagueKey = colleague.id || colleague.name || index;

              return (
                <Stack key={colleagueKey} alignItems="center">
                  <Box
                    position="relative"
                    ref={(el) => {
                      if (safeColleagueRefs.current) {
                        safeColleagueRefs.current[
                          `${data.id}-${colleagueKey}`
                        ] = el;
                      }
                      if (el) {
                        colleagueEls.current[colleagueKey] = el;
                      } else {
                        delete colleagueEls.current[colleagueKey];
                      }
                    }}
                  >
                    <ColleagueNode sx={sx} node={colleague} />

                    {hasHandleDrawer && (
                      <Fab
                        data-cy="responsibility-button"
                        color="default"
                        size="small"
                        onClick={() => handleDrawerOpen(null)}
                        sx={{
                          width: 32,
                          height: 32,
                          minHeight: "auto",
                          boxShadow: 2,
                          position: "absolute",
                          top: "30%",
                          right: -40,
                          transform: "translateY(-50%)",
                        }}
                      >
                        <EditIcon />
                      </Fab>
                    )}

                    <Fab
                      data-cy="colleague-page-button"
                      color="default"
                      size="small"
                      onClick={() => {
                        if (colleague.id) {
                          navigate(`/colleagues/${colleague.id}`);
                        }
                      }}
                      sx={{
                        width: 32,
                        height: 32,
                        minHeight: "auto",
                        boxShadow: 2,
                        position: "absolute",
                        top: "70%",
                        right: -40,
                        transform: "translateY(-50%)",
                      }}
                    >
                      <WorkIcon />
                    </Fab>
                  </Box>

                  {colleagueResponsibilities.length > 0 && (
                    <Stack
                      direction="column"
                      spacing={2}
                      justifyContent="center"
                      sx={{ mt: 6 }}
                    >
                      {colleagueResponsibilities.map(
                        (responsibility, rIndex) => (
                          <Box
                            sx={{ position: "relative" }}
                            key={`resp-${rIndex}-${
                              responsibility.id || responsibility.title
                            }`}
                            ref={(el) => {
                              if (safeResponsibilityRefs.current) {
                                safeResponsibilityRefs.current[
                                  `${data.id}-${colleague.id}-responsibility-${rIndex}`
                                ] = el;
                              }

                              if (!responsibilityEls.current[colleagueKey]) {
                                responsibilityEls.current[colleagueKey] = [];
                              }

                              if (el) {
                                responsibilityEls.current[colleagueKey][
                                  rIndex
                                ] = el;
                              } else {
                                responsibilityEls.current[colleagueKey][
                                  rIndex
                                ] = undefined;
                              }
                            }}
                          >
                            <ResponsibilityNode
                              responsibility={responsibility}
                              sx={sx}
                            />

                            {hasHandleDrawer && (
                              <Fab
                                color="default"
                                size="small"
                                onClick={() => {
                                  if (responsibility) {
                                    handleDrawerOpen(responsibility);
                                  }
                                }}
                                sx={{
                                  width: 32,
                                  height: 32,
                                  minHeight: "auto",
                                  boxShadow: 2,
                                  position: "absolute",
                                  top: "50%",
                                  right: -40,
                                  transform: "translateY(-50%)",
                                }}
                              >
                                <EditIcon />
                              </Fab>
                            )}
                          </Box>
                        )
                      )}
                    </Stack>
                  )}
                </Stack>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default TeamWithColleagues;
