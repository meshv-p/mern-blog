import { Avatar, Button, Card, CardActions, CardContent, CardMedia, Container, CssBaseline, Grid, Paper, Stack, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import blogContext from '../Context/BlogContext';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export const Profie = () => {
    const context = useContext(blogContext);
    let { theme, toggleTheme, url } = context;
    const [profile, setProfile] = useState(null)
    // let { username } = useParams()
    let history = useNavigate()
    let { userId } = useParams()
    // console.log(username)

    useEffect(() => {
        console.log(userId);
        fetch(`${url}/api/v1/users/${userId}`).then(res => res.json()).then(data => setProfile(data.oneUser))
    }, [])


    const darkTheme = createTheme({
        palette: {
            mode: theme ? 'light' : 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });

    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        // console.log(color);
        /* eslint-enable no-bitwise */
        return color;
    }
    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
                display: 'flex', justifyContent: 'center', width: 100, height: 100, mt: -8
            },
            children: name.charAt(0),
        };
    }

    return (
        <>
            <ThemeProvider theme={darkTheme}>

                {/* <Typography variant="body1" sx={{ mt: 2, ml: 5 }}>Profile</Typography> */}
                <Container sx={{ mt: 3 }} component="main" >
                    <CssBaseline />
                    <Paper sx={{ p: 2 }}>
                        <Typography sx={{ m: 1 }}>
                            <Button variant="outlined" onClick={() => history('/')} color="inherit" startIcon={<ArrowBackIosNewIcon />}>
                                Go back
                            </Button>
                        </Typography>

                        <Card>
                            <CardMedia
                                component="img"
                                height="240"
                                image="https://source.unsplash.com/random/300x200"
                                alt="green iguana"
                            />
                            <CardContent >
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    {/* <Avatar sx={{ display: 'flex', justifyContent: 'center', width: 100, height: 100, mt: -8 }}>
                                        A
                                    </Avatar> */}
                                    <Avatar src={profile?.Profile_pic} alt="Username"  {...stringAvatar(profile?.username ? profile?.username : 'Abc')} />

                                </Box>

                                {/* Profile data goes here */}
                                <Stack gap={3}>
                                    {/* <Stack direction="row" alignItems="center" gap={3}>
                                        <Typography>Name:  </Typography>
                                        <TextField id="standard-basic" value={profile.} variant="standard" />
                                    </Stack> */}
                                    <Stack direction="row" alignItems="center" gap={3}>
                                        <Typography>Username:  </Typography>
                                        <TextField id="standard-basic" value={profile?.username} variant="standard" />
                                    </Stack>
                                    <Stack direction="row" alignItems="center" gap={3}>
                                        <Typography>Number</Typography>
                                        <TextField id="standard-basic" value={profile?.number === 0 ? 'Not set' : ''} variant="standard" />
                                    </Stack>
                                    <Stack direction="row" alignItems="center" gap={3}>
                                        <Typography>Email:</Typography>
                                        <TextField id="standard-basic" value={profile?.email} variant="standard" />
                                    </Stack>
                                </Stack>
                            </CardContent>
                            <CardActions>
                                <Button variant='text' >Cancel</Button>
                                <Button variant='contained'>Save</Button>
                            </CardActions>
                        </Card>




                        {/* <Typography variant="body1" >Profile</Typography> */}
                        {/* <Grid container >
                            <Grid item>
                                {/* here back pic */}
                        {/* <Stack direction="row" alignItems="center" gap={2}   >
                                    <Avatar>A</Avatar> */}
                        {/* <Avatar src={blog.user[0]?.Profile_pic} alt="Username" {...stringAvatar(blog.user[0]?.username ? blog.user[0].username : 'Admin')} /> */}

                        {/* <Typography>Profile</Typography>
                                </Stack>
                                <Box sx={{ m: 2 }}>
                                    <Paper sx={{ p: 1 }} elevation={2}>
                                        <Stack gap={2} >
                                            <TextField id="outlined-basic" label="username" value={username} disabled variant="outlined" />
                                            <TextField id="outlined-basic" label="Email" value={username} variant="outlined" />
                                            <TextField id="outlined-basic" label="Number" value={username} variant="outlined" />
                                        </Stack>
                                    </Paper>
                                </Box>
                                <Button variant='text' >Cancel</Button>
                                <Button variant='contained'>Save</Button>
                            </Grid>
                        </Grid>  */}



                    </Paper>
                </Container>
            </ThemeProvider>
        </>
    )
}
