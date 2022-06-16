import React, { useContext, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import blogContext from "../Context/BlogContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import { Head } from "../Compo/Head";
export const ResetPassword = () => {
  let history = useNavigate();
  let { token } = useParams()
  const context = useContext(blogContext);
  let { theme, url } = context;
  const [resetPass, setResetPass] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const darkTheme = createTheme({
    palette: {
      mode: theme ? "light" : "dark",
      primary: {
        main: "#1976d2",
      },
    },
  });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleSubmit = async () => {

    setLoading(true)
    let res = await fetch(`${url}/api/v1/users/password-reset/${token}`, {
      method: "POST",
      body: JSON.stringify({ password: resetPass }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).catch(err => {
      setLoginError({ type: 'error', msg: err.message })
      setOpen(true)
      setLoading(false)
    });
    console.log(res.status);
    let data = await res.json()
    console.log(data);
    if (res.status === 200) {
      setLoading(false)
      setLoginError({ type: "success", msg: data.msg })
      // history('/')
      setOpen(true)
    }
    else {
      setLoading(false)
      setLoginError({ type: "error", msg: data.msg })
      setOpen(true)
      // await console.log(loginError);
    }
    setLoading(false)

  }



  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Head title="Set a New Password to Dev blog" />
          <Paper sx={{ px: 2 }}>
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" align="center">
                Set a new Password
              </Typography>
              {
                loginError && <Typography variant="body2" color={loginError.type === 'success' ? 'green' : 'error'} gutterBottom>
                  {loginError.msg}
                </Typography>
              }
              <Typography variant="caption" display="block" gutterBottom>
                Enter your new password,which will reflect in your account now
                onwards.
              </Typography>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  autoFocus
                  type="password"
                  value={resetPass}
                  onChange={(e) => setResetPass(e.target.value)}
                />

                <LoadingButton
                  onClick={handleSubmit}
                  loading={loading}
                  loadingPosition="end"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3, mb: 2 }}
                  endIcon={<LockOutlinedIcon />}
                >
                  Done
                </LoadingButton>
              </Box>
            </Box>
          </Paper>
          <Snackbar
            open={open}
            autoHideDuration={1000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleClose}
              severity={loginError?.type}
              sx={{ width: "100%" }}
            >
              {loginError?.msg}
            </Alert>
          </Snackbar>
        </Container>
      </ThemeProvider>
    </div>
  );
};
