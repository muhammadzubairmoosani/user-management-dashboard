import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";

export const ButtonLoading = ({ loading, children }) => {
  return (
    <LoadingButton
      type="submit"
      loading={loading}
      loadingPosition="end"
      endIcon={<AddIcon />}
      variant="outlined"
    >
      {children}
    </LoadingButton>
  );
};
