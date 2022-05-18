import { Avatar, Button, Card, CardContent, CardMedia, Container, CssBaseline, Divider, Paper, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import blogContext from '../Context/BlogContext';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useFetch } from '../hooks/useFetch';

export const Profie = () => {
    const context = useContext(blogContext);
    let { theme, url, loggedinUser } = context;
    // const [profile, setProfile] = useState(null)
    const [follow, setFollow] = useState(false)
    let history = useNavigate()
    let { userId } = useParams()
    let { data: profile, isLoading, error } = useFetch(`${url}/api/v1/users/${userId}`, 'oneUser')

    useEffect(() => {
        console.log(profile );
        profileSet()
        setFollow((profile?.followers)?.includes(loggedinUser?.profile.user))
        // eslint-disable-next-line
    }, [])

// atlic,



    const profileSet = () => {
        fetch(`${url}/api/v1/users/${userId}`).then(res => res.json()).then(data => {
            // setProfile(data.oneUser)
            // console.log(profile);
            // console.log(profile?.followers);
            // console.log(follow);
        })
    }


    const darkTheme = createTheme({
        palette: {
            mode: theme ? 'light' : 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });





    const followUser = () => {
        setFollow(!follow)
        fetch(`${url}/api/v1/users/friends/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loggedinUser.authToken}`
            }
        }).then(res => res.json()).then(data => {
            // console.log(data);
            profileSet()
        })
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



                        {
                            (profile) !== null &&


                            <Card>
                                <CardMedia
                                    component="img"
                                    height="240"
                                    image="https://source.unsplash.com/random/300x200"
                                    alt="green iguana"
                                />
                                <CardContent >
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Avatar sx={{ display: 'flex', justifyContent: 'center', width: 100, height: 100, mt: -8 }}>
                                            A
                                        </Avatar>
                                        {/* <UserAvatar src={Profie?.Profile_pic} name={profile.user[0]?.username ?? 'User'} big={true} /> */}

                                        {/* <Avatar src={profile?.Profile_pic} alt="Username"  {...stringAvatar(profile?.username ? profile?.username : 'Abc')} /> */}

                                    </Box>

                                    {/* Profile data goes here */}

                                    <div style={{ display: 'flex', justifyContent: 'center' }}>

                                        <Stack
                                            sx={{ my: 2, width: '50%' }}
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center"
                                            spacing={22}
                                        >
                                            <div>

                                                @{profile?.username}
                                            </div>
                                            <Stack direction='row' gap={2}>

                                                <Stack
                                                    direction="column"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                >
                                                    <Typography>{(profile?.followers)?.length}</Typography>
                                                    <Divider variant='middle' sx={{ width: '100%' }} />

                                                    <Typography>Followers</Typography>
                                                </Stack>
                                                <Stack
                                                    direction="column"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                >
                                                    {/* <div> */}

                                                    <Typography>{(profile?.following)?.length}</Typography>
                                                    <Divider variant='middle' sx={{ width: '100%' }} />

                                                    <Typography>Following</Typography>
                                                    {/* </div> */}
                                                </Stack>
                                            </Stack>

                                        </Stack>


                                    </div>
                                    {
                                        loggedinUser?.profile?.user !== userId &&


                                        <Stack
                                            sx={{ my: 2 }}
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center"
                                            spacing={2}
                                        >
                                            <Button

                                                variant={
                                                    follow !== null ?
                                                        'contained'
                                                        : 'text'
                                                }




                                                onClick={followUser}>{follow !== null ? 'Unfollow' : 'Follow'}</Button>
                                            <Button variant='outlined'>Message</Button>


                                        </Stack>
                                    }
                                    <Stack gap={3}>
                                        {/* <Stack direction="row" alignItems="center" gap={3}>
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
                                    </Stack> */}
                                        <Stack direction="row" alignItems="center" gap={3}>
                                            {/* <Typography>Email:</Typography> */}
                                            {profile?.email}
                                            {/* <TextField id="standard-basic" value={profile?.email} variant="standard" /> */}
                                        </Stack>

                                    </Stack>
                                </CardContent>
                                {/* <CardActions>
                                <Button variant='text' >Cancel</Button>
                                <Button variant='contained'>Save</Button>
                            </CardActions> */}
                            </Card>

                        }


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
