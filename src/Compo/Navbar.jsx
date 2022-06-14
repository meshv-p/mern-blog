import React, { useState, useContext, useEffect } from 'react'
import { AppBar, Avatar, Badge, Button, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { useFetch } from '../hooks/useFetch'
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link, useNavigate } from 'react-router-dom';
import blogContext from '../Context/BlogContext';
import LoadingBar from 'react-top-loading-bar'
import { UserAvatar } from './UserAvatar';
import ChatBubble from '@mui/icons-material/ChatBubble';
import { SearchBar } from './SearchBar';

import DoneIcon from '@mui/icons-material/Done';
export const Navbar = () => {
    const context = useContext(blogContext);
    let { theme, toggleTheme, loggedinUser, progress, userNotification, url } = context;
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user'))?.profile)
    const [notifications, setNotiAnchorEl] = React.useState(null);
    let { data, isLoading, error, setData } =  useFetch(`${url}/api/v1/notification/`, {
        method: 'GET',
        headers: {
            'Authorization': `${JSON.parse(localStorage.getItem("user"))?.authToken}`
        }
    });


    let history = useNavigate()

    useEffect(() => {
        console.log(loggedinUser)
        setCurrentUser(loggedinUser?.profile);
        // console.log(loggedinUser.profile.user)
    }, [loggedinUser])


    useEffect(() => {
        console.log(data);

        return () => {

        }
    }, [isLoading])






    const darkTheme = createTheme({
        palette: {
            mode: theme ? 'light' : 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });


    function handleReadNoti(notiID) {
        setData(data?.filter(noti => noti._id !== notiID));
        fetch(`${url}/api/v1/notification/`, {
            method: 'PATCH',
            body: JSON.stringify({
                "id": `${notiID}`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': (JSON.parse(localStorage.getItem('user'))?.authToken || JSON.parse(sessionStorage.getItem('user'))?.authToken)
            }
        }).then(res => res.json()).then(data => console.log(data));
    }

    return (
        <div>
            <ThemeProvider theme={darkTheme}>

                <AppBar position='static'>
                    <LoadingBar
                        color='#f11946'
                        progress={progress}
                    // onLoaderFinished={() => setProgress(0)}
                    />
                    <Toolbar>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Typography>Dev-Blog</Typography>
                        </Link>
                        <SearchBar />
                        {/* <Search >
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search> */}
                        <Box sx={{ flexGrow: 1 }} />

                        <Box>
                            <IconButton
                                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                                onClick={() => history('/chat')}
                                size="large"
                                aria-label="Change theme"
                                color="inherit"
                            >

                                <ChatBubble />

                            </IconButton>
                            <IconButton
                                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                                onClick={toggleTheme}
                                size="large"
                                aria-label="Change theme"
                                color="inherit"
                            >

                                <Brightness4Icon />

                            </IconButton>
                            <IconButton
                                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                                onClick={e => setNotiAnchorEl(e.currentTarget)}
                                onClose={() => setNotiAnchorEl(null)}
                                size="large"
                                aria-label="show 17 new notifications"
                                color="inherit"
                            >
                                <Badge badgeContent={data?.length} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={notifications}
                                open={Boolean(notifications)}
                                onClose={() => setNotiAnchorEl(null)}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <List sx={{ maxWidth: 360, }}>
                                    {/* {
                                        error && <div>{error}</div>
                                    } */}
                                    {
                                        loggedinUser && data?.length !== 0 &&
                                        data?.map(noti => (
                                            <>

                                                <ListItem alignItems="flex-start"
                                                    key={noti._id}
                                                    secondaryAction={
                                                        <IconButton edge="end" aria-label="delete"
                                                            onClick={(e) => handleReadNoti(noti._id)}
                                                        >
                                                            <DoneIcon />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <UserAvatar src={noti.from[0].Profile_pic} name={noti.from[0].username} />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Link to={'/user/' + noti.from[0]._id}>
                                                                {noti.from[0].username}
                                                            </Link>
                                                        }
                                                        secondary={`${noti.from[0].username} ${noti.text}`}
                                                    />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                            </>
                                        ))
                                    }
                                </List>
                            </Menu>

                            {/* user information after login */}
                            {
                                currentUser ?
                                    <>
                                        <Button variant='text'
                                            color='inherit'
                                            size='large'
                                            onClick={(e) => setAnchorElUser(e.currentTarget)}

                                            startIcon={
                                                <UserAvatar src={currentUser?.Profile_pic} name={currentUser?.username ?? 'User'} />
                                            }>
                                            <Typography sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>{currentUser?.username}</Typography>

                                        </Button>

                                        <Menu
                                            sx={{ mt: '45px' }}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={() => setAnchorElUser(null)}
                                        >
                                            <MenuItem onClick={() => setAnchorElUser(null)}>
                                                <Link to={{
                                                    pathname: `/user/${loggedinUser?.profile?._id}`,
                                                    state: { name: 'meshv' }

                                                }} >
                                                    <Typography>Profile</Typography>
                                                </Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link to='/create'>
                                                    <Typography>Create blog</Typography>
                                                </Link>
                                            </MenuItem>
                                            <MenuItem onClick={() => { localStorage.removeItem('user'); setCurrentUser(null); setAnchorElUser(null) }}>
                                                <Typography>Logout</Typography>
                                            </MenuItem>
                                            {/* <MenuItem>
                                                <Typography>
                                                    <Link to="/login" onClick={() => setAnchorElUser(null)} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        Login
                                                    </Link>
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem>
                                                <Typography>
                                                    <Link to="/signup" onClick={() => setAnchorElUser(null)} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        Signup
                                                    </Link>
                                                </Typography>
                                            </MenuItem> */}

                                        </Menu>
                                    </>
                                    :
                                    <>

                                        <Button color="inherit" variant="text" sx={{ mx: 1, fontSize: '10px' }} onClick={() => history('/signup')} >Sign Up</Button>
                                        <Button color="inherit" sx={{ fontSize: { xs: '10px' } }} variant='outlined' onClick={() => history('/login')}>Login</Button>

                                    </>



                            }
                        </Box>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </div >
    )
}
