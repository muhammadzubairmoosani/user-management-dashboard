import TextField from "@mui/material/TextField";

export const InputText = ({ label, name = "", formik = {}, onChange }) => (
  <TextField
    label={label}
    variant="outlined"
    fullWidth
    margin="normal"
    name={name}
    error={formik?.touched?.[name] && formik?.errors?.[name]}
    helperText={formik?.errors?.[name]}
    onChange={formik?.handleChange || onChange}
    onBlur={formik?.handleBlur}
    value={formik?.values?.[name]}
  />
);
