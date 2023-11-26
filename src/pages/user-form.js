import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  Typography,
} from "@mui/material";

import { addDoc, collection } from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  ButtonLoading,
  DropDown,
  FileUpload,
  InputText,
  SnackbarComponent,
} from "../components";
import { db, storage } from "../config/firebase";
import CountryData from "../utils/data.json";
import {
  userFormInitialValues,
  userFormValidationSchema,
} from "../utils/formik";

export const UserForm = () => {
  const [roleToggle, setRoleToggle] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const formik = useFormik({
    initialValues: userFormInitialValues,
    validationSchema: userFormValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const storageRef = ref(storage, values.profilePicture.name);
        const img = await uploadBytes(storageRef, values.profilePicture);
        const url = await getDownloadURL(img.ref);

        values.profilePicture = url;
        const docRef = collection(db, "users");
        await addDoc(docRef, values);
        setToast({
          message: "User added successfully!",
          open: true,
        });
        setSubmitting(false);
      } catch (error) {
        setToast({
          message: error.message,
          type: "error",
          open: true,
        });
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <SnackbarComponent {...toast} />

      <Grid container spacing={2} columns={{ xs: 1, sm: 12 }}>
        <Grid item xs={12}>
          <Typography component="div">Upload profile picture</Typography>
          <div
            style={{
              border: "2px dashed",
              display: "inline-block",
              padding: "2rem",
              margin: "1rem 0",
            }}
          >
            <FileUpload
              onChange={(event) => {
                formik.setFieldValue("profilePicture", event.target.files[0]);
              }}
            />
          </div>
          {formik.touched.profilePicture && formik.errors.profilePicture && (
            <Typography fontSize="12px" color="red">
              {formik.errors.profilePicture}
            </Typography>
          )}
        </Grid>

        <Grid item xs={1} sm={6}>
          <InputText label="Full Name" name="fullName" formik={formik} />
        </Grid>
        <Grid item xs={1} sm={6}>
          <InputText label="Email" name="email" formik={formik} />
        </Grid>

        <Grid item xs={1} sm={6}>
          <DropDown
            label="Country"
            select={CountryData.countries}
            name="country"
            formik={formik}
          />
        </Grid>
        <Grid item xs={1} sm={6}>
          <DropDown
            label="State"
            select={CountryData.states}
            name="state"
            formik={formik}
          />
        </Grid>

        <Grid item xs={12} mt={3}>
          <FormControl
            error={!roleToggle && formik.touched.role && formik.errors.role}
          >
            <div>
              <Switch
                checked={roleToggle}
                onClick={() => setRoleToggle(!roleToggle)}
              />
              <FormLabel id="demo-row-radio-buttons-group-label">
                Select Your Role (optional)
              </FormLabel>
            </div>
            <br />
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                disabled={!roleToggle}
                value="Student"
                name="role"
                onChange={formik.handleChange}
                control={<Radio />}
                label="Student"
              />
              <FormControlLabel
                disabled={!roleToggle}
                value="Teacher"
                name="role"
                onChange={formik.handleChange}
                control={<Radio />}
                label="Teacher"
              />
              <FormControlLabel
                disabled={!roleToggle}
                value="Other"
                name="role"
                onChange={formik.handleChange}
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
            <FormHelperText>{formik.errors.role}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} mt={4} textAlign={"right"}>
          <ButtonLoading loading={formik.isSubmitting}>Add User</ButtonLoading>
        </Grid>
      </Grid>
    </form>
  );
};
