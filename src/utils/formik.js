import * as Yup from "yup";

export const userFormInitialValues = {
  fullName: "",
  email: "",
  profilePicture: "",
  country: "",
  state: "",
  role: "",
};

export const userFormValidationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  profilePicture: Yup.string().required("Profile Picture is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  role: Yup.string(),
});
