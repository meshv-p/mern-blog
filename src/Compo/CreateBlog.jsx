import React, { useContext, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import blogContext from '../Context/BlogContext';
import { Button, Card, Container, CssBaseline, Stack, TextField, Typography, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MuiAlert from '@mui/material/Alert';

export const CreateBlog = () => {
    const context = useContext(blogContext);
    let { theme, url, loggedinUser } = context;
    const [open, setOpen] = React.useState(false);
    const [blogError, setBlogError] = useState(null)
    const [blog, setBlog] = useState({
        title: "",
        desc: "",
        tag: []
    })


    const darkTheme = createTheme({
        palette: {
            mode: theme ? 'light' : 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });

    let history = useNavigate()

    const handleSubmit = async () => {
        await console.log('before', blog);
        await setBlog({ ...blog, tag: blog.tag?.split(',') })
        await console.log('after', blog);

        let res = await fetch(`${url}/api/v1/blogs`, {
            method: 'POST',
            body: JSON.stringify(blog),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loggedinUser.authToken}`
            }
        })

        let status = await res.json()
        if (res.status === 200) {
            setOpen(true)
            setBlogError({ type: "success", msg: "Blog Published..." })
            setBlog({
                title: "", desc: "",
                tag: []
            })
        }
        else {

            setBlogError({ type: "error", msg: status.msg })
            setOpen(true)
        }

    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Container>
                    <Card sx={{ m: 1, p: 1 }}>
                        <Typography sx={{ m: 1 }}>
                            <Button variant="outlined" onClick={() => history('/')} color="inherit" startIcon={<ArrowBackIosNewIcon />}>
                                Go back
                            </Button>
                        </Typography>
                        <Typography textAlign='center' variant='h5' sx={{ my: 2 }} color="text.secondary">Create a blog...</Typography>

                        <Stack gap={3}>
                            <TextField id="outlined-basic" label="Title" onChange={e => setBlog({ ...blog, [e.target.name]: e.target.value })} name='title' variant="outlined" />
                            <TextField id="outlined-basic" name='desc' onChange={e => setBlog({ ...blog, [e.target.name]: e.target.value })} label="Enter your descriptions.." variant="outlined" />
                            <TextField id="outlined-basic" name='tag' onChange={e => setBlog({ ...blog, tag: e.target.value })} label="Tags" variant="outlined" />
                            <Button variant="text">Cancel</Button>
                            <Button variant="contained" onClick={handleSubmit}>Publish blog</Button>

                        </Stack>
                    </Card>
                    <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                        <Alert onClose={handleClose} severity={blogError?.type} sx={{ width: '100%' }}>
                            {blogError?.msg}
                        </Alert>
                    </Snackbar>
                </Container>
            </ThemeProvider>
        </>
    )
}
