import { Alert, Snackbar } from "@mui/material";
import React from "react";

export const SnackbarComponent = ({ open, message, type = "success" }) => (
  <Snackbar open={open} autoHideDuration={6000}>
    <Alert severity={type} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);
