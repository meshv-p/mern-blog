import React, { useContext, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import blogContext from '../Context/BlogContext';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { useFetch } from '../hooks/useFetch';
import { Alert, Snackbar } from '@mui/material';
import { Head } from '../Compo/Head';

export const Signup = () => {

    let history = useNavigate()

    const [signupDetails, setSignupDetails] = useState({
        username: "",
        password: "",
        email: "",
        name: ""
    })
    const [loading, setLoading] = useState(false)
    const [signinError, setSigninError] = useState("")
    const [open, setOpen] = React.useState(false);

    const context = useContext(blogContext)
    let { theme, url } = context;
    // let { isLoading, data, error } = useFetch(`${url}/api/v1/users/`)
    const darkTheme = createTheme({
        palette: {
            mode: theme ? 'light' : 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });


    const handleSubmit = async () => {
        console.log(signupDetails)


        setLoading(true)
        let res = await fetch(`${url}/api/v1/users/`, {
            method: "POST",
            body: JSON.stringify(signupDetails),
            headers: {
                'Content-Type': 'application/json',
            }
        }).catch(err => {
            setSigninError({ type: 'error', msg: err.message })
            setOpen(true)
            setLoading(false)
        });
        let status = await res.json()
        if (res.status === 200) {
            setLoading(false)
            setOpen(true)
            setSigninError({ type: "success", msg: "Account Created successfully." })
            // localStorage.setItem('user', JSON.stringify(status))
            // history('/login')
        }
        else {
            setLoading(false)
            console.log(status);
            setSigninError({ type: "error", msg: status.err })
            setOpen(true)
            // await console.log(loginError);
        }

    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    return (
        <div>
            <ThemeProvider theme={darkTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Head title='Make a new account on Dev Blog' />

                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="name"
                                        required
                                        fullWidth
                                        id="Name"
                                        label="Name"
                                        autoFocus
                                        value={signupDetails.name}
                                        onChange={(e) => setSignupDetails({ ...signupDetails, [e.target.name]: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        autoComplete="family-name"
                                        value={signupDetails.username}
                                        onChange={(e) => setSignupDetails({ ...signupDetails, [e.target.name]: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        type='email'
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        value={signupDetails.email}
                                        onChange={(e) => setSignupDetails({ ...signupDetails, [e.target.name]: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        value={signupDetails.password}
                                        onChange={(e) => setSignupDetails({ ...signupDetails, [e.target.name]: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                                        label="I want to receive inspiration, marketing promotions and updates via email."
                                    />
                                </Grid>
                            </Grid>
                            <LoadingButton
                                onClick={handleSubmit}
                                loading={loading}
                                loadingPosition="end"
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                fullWidth
                                endIcon={<LockOutlinedIcon />}
                            >
                                sign in
                            </LoadingButton>
                            {/* <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleSubmit}
                            >
                                Sign Up
                            </Button> */}
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link to="/login" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                        <Alert onClose={handleClose} severity={signinError?.type} sx={{ width: '100%' }}>
                            {signinError?.msg}
                        </Alert>
                    </Snackbar>
                </Container>
            </ThemeProvider>
        </div>
    )
}
