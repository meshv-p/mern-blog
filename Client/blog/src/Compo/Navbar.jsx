import React, { useState, useContext, useEffect } from 'react'
import { AppBar, Avatar, Badge, Button, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import { Box } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link, useNavigate } from 'react-router-dom';
import blogContext from '../Context/BlogContext';


export const Navbar = () => {
    const context = useContext(blogContext);
    let { theme, toggleTheme, loggedinUser } = context;
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user'))?.profile)

    let history = useNavigate()

    useEffect(() => {
        setCurrentUser(loggedinUser?.profile);
        // console.log(loggedinUser.profile.user)
    }, [loggedinUser])




    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    }));
    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '20ch',
            },
        },
    }));

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
            },
            children: name.charAt(0),
        };
    }

    // stringToColor('meshv')
    return (
        <div>
            <ThemeProvider theme={darkTheme}>

                <AppBar position='static'>
                    <Toolbar>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Typography>Dev-Blog</Typography>
                        </Link>

                        <Search >
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />

                        <Box>
                            <IconButton

                                onClick={toggleTheme}
                                size="large"
                                aria-label="Change theme"
                                color="inherit"
                            >

                                <Brightness4Icon />

                            </IconButton>
                            <IconButton
                                size="large"
                                aria-label="show 17 new notifications"
                                color="inherit"
                            >
                                <Badge badgeContent={17} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            {/* user information after login */}
                            {
                                currentUser ?
                                    <>
                                        <IconButton
                                            size="large"
                                            aria-label="Profile"
                                            aria-haspopup="true"
                                            color="inherit"
                                            onClick={(e) => setAnchorElUser(e.currentTarget)}
                                        >
                                            {/* <Avatar  {...stringAvatar(currentUser?.username)}>

                                                {/* {currentUser?.Profile_pic ? currentUser.Profile_pic : currentUser?.username.charAt(0)} 
                                            </Avatar> */}
                                            <Avatar src={currentUser?.Profile_pic} alt="Username" {...stringAvatar(currentUser?.username)} />

                                            <Typography sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>{currentUser?.username}</Typography>
                                        </IconButton>
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
                                                <Link to={`/user/${loggedinUser?.profile?.user}`} >
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

                                        <Button color="inherit" variant="text" sx={{ mx: 1 }} onClick={() => history('/signup')} >Sign Up</Button>
                                        <Button color="inherit" variant='outlined' onClick={() => history('/login')}>Login</Button>

                                    </>



                            }
                        </Box>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </div >
    )
}
