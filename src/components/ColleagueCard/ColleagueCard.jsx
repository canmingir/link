import ColleagueAvatar from "../ColleagueAvatar/ColleagueAvatar";
import InfoText from "../InfoText/InfoText";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextFieldWithTitle from "../TextFieldWithTitle/TextFieldWithTitle";
import TitleBar from "../TitleBar/TitleBar";
import styles from "./styles";

import {
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const ColleagueCard = ({
  colleague,
  onColleagueClick,
  onDelete,
  onEdit,
  isLastColleague,
  topBar,
  showBackstory = false,
  responsive,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const [topBarMargin, setTopBarMargin] = useState();
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    topBar ? setTopBarMargin("50px") : setTopBarMargin("0");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Card
        onClick={onColleagueClick}
        sx={{
          ...styles.card,
          maxHeight: !responsive && 116,
        }}
      >
        {topBar && <TitleBar title={"Colleague"} />}
        <CardContent sx={{ marginTop: topBarMargin }}>
          <Grid container spacing={10}>
            <Grid item xs={3}>
              <ColleagueAvatar
                colleague={colleague}
                sizeFor={"colleagueCard"}
              />
            </Grid>
            <Grid item xs={9}>
              <InfoText colleague={colleague} />
            </Grid>
            {showBackstory && colleague.systemMessage && (
              <Grid item xs={12}>
                <TextFieldWithTitle
                  textTitle={"Backstory"}
                  textField={colleague?.systemMessage}
                />
              </Grid>
            )}
          </Grid>

          <IconButton onClick={handleMenuClick} sx={styles.menuButton}>
            <MoreVertIcon sx={{ color: "primary.main" }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {onEdit && (
              <MenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  handleMenuClose();
                  onEdit();
                }}
              >
                Edit
              </MenuItem>
            )}
            {onDelete && !isLastColleague && (
              <MenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  handleMenuClose();
                  onDelete();
                }}
              >
                Delete
              </MenuItem>
            )}
          </Menu>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ColleagueCard;
