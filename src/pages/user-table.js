import {
  Avatar,
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import CircularProgress from "@mui/material/CircularProgress";
import { visuallyHidden } from "@mui/utils";
import { collection, getDocs } from "firebase/firestore/lite";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { InputText, SnackbarComponent } from "../components";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "fullName", label: "Full Name" },
  { id: "email", label: "Email" },
  { id: "Country", label: "country" },
  { id: "state", label: "State" },
  { id: "role", label: "role" },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export const UserTable = () => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState([]);
  const rowsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const filteredUsers = users.filter((user) => {
    const fullNameMatches = user.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const emailMatches = user.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const countryMatches = user.country
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const stateMatches = user.state
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const roleMatches = user.role
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return (
      fullNameMatches ||
      emailMatches ||
      countryMatches ||
      stateMatches ||
      roleMatches
    );
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchUsers = async () => {
    try {
      const collectionRef = collection(db, "users");
      const { docs } = await getDocs(collectionRef);
      const users = docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setUsers(users);
      setLoading(false);
    } catch (error) {
      setToast({
        message: error.message,
        type: "error",
        open: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredUsers, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredUsers]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <SnackbarComponent {...toast} />

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Stack p={3} spacing={1}>
          <InputText
            value={searchQuery}
            onChange={handleSearchChange}
            label="Search"
          />
        </Stack>

        {loading ? (
          <Box p={14} textAlign="center">
            <CircularProgress />
          </Box>
        ) : !visibleRows.length ? (
          <div style={{ textAlign: "center", padding: " 4rem" }}>
            <ManageSearchIcon fontSize="large" />
            <Typography variant="h5">No Users Found</Typography>
          </div>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={users.length}
              />
              <TableBody>
                {visibleRows.map((row) => {
                  return (
                    <TableRow hover key={row.id}>
                      <TableCell component="th" scope="row">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar alt="avatar" src={row.profilePicture} />
                          <span>{row.fullName}</span>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.country}</TableCell>
                      <TableCell align="left">{row.state}</TableCell>
                      <TableCell align="left">
                        {row.role ? (
                          <Chip label={row.role} color="primary" />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
};
