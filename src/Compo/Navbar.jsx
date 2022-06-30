import React, { useState, useContext, useEffect } from 'react'
import {
    AppBar,
    Avatar,
    Badge,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    SwipeableDrawer,
    Toolbar,
    Typography
} from '@mui/material'
import { Box } from '@mui/system';
import { useFetch } from '../hooks/useFetch'
import NotificationsIcon from '@mui/icons-material/Notifications';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link, useNavigate } from 'react-router-dom';
import blogContext from '../Context/BlogContext';
import LoadingBar from 'react-top-loading-bar'
import { UserAvatar } from './UserAvatar';
import ChatBubble from '@mui/icons-material/ChatBubble';
import { SearchBar } from './SearchBar';
import DoneIcon from '@mui/icons-material/Done';
import MenuIcon from '@mui/icons-material/Menu';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export const Navbar = () => {
    const context = useContext(blogContext);
    let { toggleTheme, loggedinUser, progress, url } = context;
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user'))?.profile)
    const [notifications, setNotiAnchorEl] = React.useState(null);
    let { data, setData } = useFetch(`${url}/api/v1/notification/`, {
        method: 'GET',
        headers: {
            'Authorization': `${JSON.parse(localStorage.getItem("user"))?.authToken}`
        }
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    let history = useNavigate()

    useEffect(() => {
        setCurrentUser(loggedinUser?.profile);
    }, [loggedinUser])




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
            <AppBar position='static'>
                <LoadingBar
                    color='#f11946'
                    progress={progress}
                // onLoaderFinished={() => setProgress(0)}
                />
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setIsDrawerOpen(true)}
                        edge="start"
                        sx={{ display: { xs: 'flex', md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <SwipeableDrawer
                        onOpen={() => setIsDrawerOpen(true)}
                        open={isDrawerOpen}
                        onClose={() => setIsDrawerOpen(false)}
                    >
                        <Box p={2}>
                            <Typography variant="h6" noWrap>
                                Dev Blog
                            </Typography>
                        </Box>
                        <Divider />
                        {/* List with icons */}
                        <List>
                            <ListItem button key="Home" component={Link} to="/" onClick={() => setIsDrawerOpen(false)}>
                                <ListItemIcon>
                                    <HomeRoundedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItem>

                            {/* Chat */}
                            <ListItem button key="Create" component={Link} to="/chat" onClick={() => setIsDrawerOpen(false)}>
                                <ListItemIcon>
                                    <ChatBubble />
                                </ListItemIcon>
                                <ListItemText primary="Chat" />
                            </ListItem>
                            {/* create a blog */}
                            <ListItem button key="Create" component={Link} to="/create" onClick={() => setIsDrawerOpen(false)}>
                                <ListItemIcon>
                                    <AddCircleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Create" />
                            </ListItem>
                            {/* toggle dark theme */}
                            <ListItem button key="Toggle" onClick={() => toggleTheme()} >
                                <ListItemIcon>
                                    <Brightness4Icon />
                                </ListItemIcon>
                                <ListItemText primary="Dark Theme" />
                            </ListItem>
                        </List>
                        <Divider />
                        {/* Profile */}
                        <ListItem button key="Profile" component={Link} to={`/user/${loggedinUser?.profile?._id}`} onClick={() => setIsDrawerOpen(false)}>
                            <ListItemIcon>
                                <UserAvatar user={loggedinUser?.profile?.Profile_pic} name={loggedinUser?.profile?.username} />
                            </ListItemIcon>
                            <ListItemText primary={loggedinUser?.profile?.username} />
                        </ListItem>
                        <List>
                            <ListItem button key="Logout" component={Link} to="/login" onClick={() => {
                                sessionStorage.removeItem('user');
                                localStorage.removeItem('user');
                                setCurrentUser(null);
                                setAnchorElUser(null)
                            }}>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </List>



                    </SwipeableDrawer>


                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        {/*<img src={LOGO} alt="Dev-Blog" style={{width:'auto',height:'auto'}}/>*/}

                        <Typography sx={{ display: { xs: 'none', md: 'flex' } }}>Dev Blog</Typography>
                    </Link>
                    <SearchBar />

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
                            sx={{ display: { xs: 'inline-flex', md: 'inline-flex' } }}
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
                                    localStorage.getItem("user") && data?.length !== 0 &&
                                    data?.map(noti => (
                                        <React.Fragment key={noti._id}>

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
                                                        <UserAvatar src={noti.from[0].Profile_pic}
                                                            name={noti.from[0].username} />
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
                                        </React.Fragment>
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
                                            <UserAvatar src={currentUser?.Profile_pic}
                                                name={currentUser?.username ?? 'User'} />
                                        }>
                                        <Typography sx={{
                                            ml: 1,
                                            display: { xs: 'none', md: 'block' }
                                        }}>{currentUser?.username}</Typography>

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

                                            }}>
                                                <Typography>Profile</Typography>
                                            </Link>
                                        </MenuItem>
                                        <MenuItem onClick={() => setAnchorElUser(null)}>
                                            <Link to='/chat'>
                                                <Typography>Chat</Typography>
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link to='/create'>
                                                <Typography>Create blog</Typography>
                                            </Link>
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            localStorage.removeItem('user');
                                            setCurrentUser(null);
                                            setAnchorElUser(null)
                                        }}>
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

                                    <Button color="inherit" variant="text" sx={{ mx: 1, fontSize: '10px' }}
                                        onClick={() => history('/signup')}>Sign Up</Button>
                                    <Button color="inherit" sx={{ fontSize: { xs: '10px' } }} variant='outlined'
                                        onClick={() => history('/login')}>Login</Button>

                                </>


                        }
                    </Box>
                </Toolbar>
            </AppBar>
        </div >
    )
}
