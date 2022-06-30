import React, { useContext, useState } from 'react'
import { Avatar, Box, Container, Paper, Snackbar, TextField, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import blogContext from '../Context/BlogContext';
import MuiAlert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import { Head } from './Head';
export const ForgotPassword = () => {

    const context = useContext(blogContext)
    let { url } = context;
    const [resetPassEmail, setResetPassEmail] = useState("")
    const [loginError, setLoginError] = useState(null)
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleSubmit = async () => {

        setLoading(true)
        let res = await fetch(`${url}/api/v1/users/password/reset`, {
            method: "POST",
            body: JSON.stringify({ email: resetPassEmail }),
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
        <>
            <Container component="main" maxWidth="xs">
                <Head title='Reset Password to Dev blog' />
                {/* <Collapse   in={open}>

                        <Alert severity="error"></Alert>
                    </Collapse> */}
                <Paper sx={{ px: 2 }}>
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
                        <Typography component="h1" variant="h5" align="center" >
                            Reset Password
                        </Typography>

                        {
                            loginError && <Typography variant="body2" color={loginError.type === 'success' ? 'green' : 'error'} gutterBottom>
                                {loginError.msg}
                            </Typography>
                        }
                        <Typography variant="caption" display="block" gutterBottom>
                            Enter your email address, phone number or username, and we'll send you a link to get back into your account.
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoFocus
                                type="email"
                                value={resetPassEmail}
                                onChange={(e) => setResetPassEmail(e.target.value)}
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
                                Send Reset Link
                            </LoadingButton>


                        </Box>
                    </Box>
                </Paper>
                <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleClose} severity={loginError?.type} sx={{ width: '100%' }}>
                        {loginError?.msg}
                    </Alert>
                </Snackbar>
            </Container>
        </>
    )
}
