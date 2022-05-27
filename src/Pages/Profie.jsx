import { Avatar, Button, Card, CardContent, CardMedia, Container, CssBaseline, Dialog, DialogContent, DialogTitle, Divider, IconButton, Paper, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import blogContext from '../Context/BlogContext';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useFetch } from '../hooks/useFetch';
import { Upload } from '../Compo/Upload';
import CloseIcon from '@mui/icons-material/Close';
import { UserAvatar } from '../Compo/UserAvatar';
import { Modal } from '../Compo/Modal';


export const Profie = () => {
    const context = useContext(blogContext);
    let { theme, url, loggedinUser } = context;
    // const [profile, setProfile] = useState(null)
    const [follow, setFollow] = useState(false)
    const [modelOpen, setModelOpen] = useState(false)

    let history = useNavigate()
    let { userId } = useParams()
    let { data: profile, isLoading, error, setData } = useFetch(`${url}/api/v1/users/${userId}`)

    useEffect(() => {

        if (!JSON.parse(localStorage.getItem("user"))) {
            return history('/login')
        }


        console.log(profile);
        profile && console.log((profile?.oneUser?.followers)?.includes(loggedinUser?.profile.user), 'current user is following?');
        // profileSet()
        console.log(profile?.oneUser?.followers)
        profile && setFollow((profile?.oneUser?.followers)?.includes(loggedinUser?.profile.user))

        // if (profile && (JSON.stringify(profile) !== JSON.stringify(JSON.parse(localStorage.getItem("user"))?.profile))) {
        //     console.log('not same')
        //     let newJson = JSON.parse(localStorage.getItem("user"))
        //     newJson.profile = profile.oneUser;
        //     localStorage.setItem("user", JSON.stringify(newJson))
        // }
        // else {
        //     console.log('s');
        // }

        // eslint-disable-next-line
    }, [profile, loggedinUser])

    // atlic,





    const profileSet = () => {
        fetch(`${url}/api/v1/users/${userId}`).then(res => res.json()).then(data => {
            setData(data)
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
            console.log(data);
            profileSet()
        })
    }
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



    function showFollowers() {
        setModelOpen(true);
        <Modal modelOpen={modelOpen} setModelOpen={setModelOpen} >

            'followers list'
        </Modal>

    }

    function showFollowing() {
        <Modal modelOpen={modelOpen} setModelOpen={setModelOpen}>
            {
                'followings list'
            }
        </Modal>
    }


    function stringAvatar(name) {


        return {
            sx: {
                bgcolor: stringToColor(name),


                display: 'flex', justifyContent: 'center', width: 100, height: 100, mt: -8,
            },
            children: name.charAt(0) || 'U',
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
                            <Button variant="outlined" onClick={() => {
                                if (history(-1)) {

                                    history(-1)
                                }
                                history('/')
                            }} color="inherit" startIcon={<ArrowBackIosNewIcon />}>
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
                                        <Avatar
                                            onClick={() => setModelOpen(true)}
                                            sx={{ display: 'flex', justifyContent: 'center', width: 100, height: 100, mt: -8 }}
                                            loading='lazy'
                                            src={profile?.oneUser?.Profile_pic} alt="Username"  {...stringAvatar(profile?.oneUser?.username ? profile?.oneUser?.username : 'Abc')} />
                                    </Box>

                                    {
                                        loggedinUser?.profile?._id === userId &&

                                        <Box sx={{ display: 'flex', justifyContent: 'end', position: 'relative', top: '-39px', right: '-1%' }}>
                                            <Upload profile={profile} user={userId} />
                                        </Box>

                                    }




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

                                                @{profile?.oneUser?.username}
                                            </div>
                                            <Stack direction='row' gap={2}>

                                                <Stack
                                                    sx={{ cursor: 'pointer' }}
                                                    direction="column"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    role="button"
                                                    onClick={() => { showFollowers() }}
                                                >
                                                    <Typography>{(profile?.oneUser?.followers)?.length}</Typography>
                                                    <Divider variant='middle' sx={{ width: '100%' }} />

                                                    <Typography>Followers</Typography>
                                                </Stack>
                                                <Stack
                                                    sx={{ cursor: 'pointer' }}

                                                    direction="column"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    role="button"
                                                    onClick={() => { showFollowing() }}


                                                >
                                                    {/* <div> */}

                                                    <Typography>{(profile?.oneUser?.following)?.length}</Typography>
                                                    <Divider variant='middle' sx={{ width: '100%' }} />

                                                    <Typography>Following</Typography>
                                                    {/* </div> */}
                                                </Stack>
                                            </Stack>

                                        </Stack>


                                    </div>
                                    {
                                        loggedinUser?.profile?._id !== userId &&


                                        <Stack
                                            sx={{ my: 2 }}
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center"
                                            spacing={2}
                                        >

                                            {
                                                follow ? <Button variant='contained' onClick={followUser}>Unfollow</Button> : <Button variant='text' onClick={followUser}>Follow</Button>
                                            }
                                            {/* <Button variant={
                                                follow !== null ?
                                                    'contained'
                                                    : 'text'
                                            }
                                                onClick={followUser}>{follow !== null ? 'Unfollow' : 'Follow'}</Button> */}

                                            <Button variant='outlined'>Message</Button>


                                        </Stack>
                                    }
                                    <Stack gap={3}>

                                        <Stack direction="row" alignItems="center" gap={3}>
                                            <Typography>Email:</Typography>
                                            {profile && profile?.oneUser?.email}
                                        </Stack>
                                        <Stack direction="row" alignItems="center" gap={3}>
                                            <Typography>Number:</Typography>
                                            {profile && profile?.oneUser?.number}
                                        </Stack>
                                        {/* <Upload user={userId} /> */}

                                    </Stack>
                                </CardContent>
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