import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { Iconify } from "../Iconify";
import Icons from "../lib/Icons";
import Picker from "@emoji-mart/react";
import React from "react";
import { SvgColor } from "../SvgColor";

import { Dialog, Stack } from "@mui/material";

export default function IconSelector({
  handleEmojiSelect,
  avatar,
  iconCategories,
}) {
  const [emojiDialogOpen, setEmojiDialogOpen] = React.useState(false);
  const handleEmojiButtonClick = () => {
    setEmojiDialogOpen(true);
  };
  return (
    <Stack alignContent={"center"} justifyContent={"center"}>
      <Stack>
        <IconButton
          data-cy="avatar-select-button"
          onClick={handleEmojiButtonClick}
          sx={{
            borderStyle: `dashed`,
            borderColor: "gray",
            borderWidth: "2px",
            mx: "auto",
            width: { xs: 77, md: 140 },
            height: { xs: 77, md: 140 },
          }}
        >
          <Avatar
            sx={{
              display: "flex",
              alignSelf: "center",
              mx: "auto",
              width: { xs: 64, md: 128 },
              height: { xs: 64, md: 128 },
              border: `solid 2px ${(theme) => theme.palette.common.white}`,
            }}
          >
            <Stack
              sx={{
                "& .svg-color": {
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                },
              }}
            >
              {avatar ? (
                <SvgColor
                  src={`https://api.iconify.design/${avatar}.svg`}
                  variant="square"
                  sx={{ width: 82, height: 82 }}
                />
              ) : (
                <Iconify icon={"ic:baseline-plus"} width={82} height={82} />
              )}
            </Stack>
          </Avatar>
        </IconButton>
      </Stack>
      <Dialog
        data-cy="avatar-selection"
        open={emojiDialogOpen}
        onClose={() => setEmojiDialogOpen(false)}
      >
        <Picker
          onEmojiSelect={(emoji) => {
            handleEmojiSelect(emoji), setEmojiDialogOpen(false);
          }}
          custom={Icons}
          categories={iconCategories}
          searchPosition={"none"}
          navPosition="none"
          emojiButtonSize={90}
          emojiSize={75}
          perLine={4}
          autoFocus="true"
          previewPosition={"none"}
          theme={"dark"}
        />
      </Dialog>
    </Stack>
  );
}
