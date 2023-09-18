import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";

import * as React from "react";

const User = React.memo(({ name, age, email }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Accordion expanded={expanded === "user"} onChange={handleChange("user")}>
      <AccordionSummary sx={{ pl: 2 }} expandIcon={<ExpandMoreIcon />}>
        <Typography>{name}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pl: 3 }}>
        <Typography>Age : {age}</Typography>
        <Typography>Email : {email}</Typography>
      </AccordionDetails>
    </Accordion>
  );
});

const Users = React.memo(({ users }) => {
  if (users?.length > 0)
    return (
      <Box sx={{ overflowY: "auto", p: 1, height: "100%", width: "100%" }}>
        {users.map((user) => (
          <User key={user?.user_id} {...user} />
        ))}
      </Box>
    );

  return null;
});

export default Users;
