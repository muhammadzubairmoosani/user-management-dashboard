import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled, Button } from "@mui/material";
import * as React from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const FileUpload = ({ onChange }) => {
  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
      Browse
    >
      <VisuallyHiddenInput onChange={onChange} type="file" accept="image/*" />
      Browse
    </Button>
  );
};
