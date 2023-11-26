import { TextField, MenuItem } from "@mui/material";

export const DropDown = ({ label, name, formik, select = [] }) => (
  <TextField
    select
    label={label}
    fullWidth
    name={name}
    error={formik.touched[name] && formik.errors[name]}
    helperText={formik.errors[name]}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values[name]}
  >
    {select.map((option) => (
      <MenuItem key={option.name} value={option.name}>
        {option.name}
      </MenuItem>
    ))}
  </TextField>
);
