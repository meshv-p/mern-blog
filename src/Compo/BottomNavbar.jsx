import React, { useContext, useEffect } from 'react'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Avatar, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import blogContext from '../Context/BlogContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { UserAvatar } from './UserAvatar';

export const BottomNavbar = () => {

    const context = useContext(blogContext);
    let { loggedinUser, theme } = context;
    const [value, setValue] = React.useState('home');
    let history = useNavigate()
    let path = useLocation()

    useEffect(() => {
        if (path.pathname == '/') {
            setValue('home')
        }
        else if (path.pathname == '/create') {
            setValue('create')
        }
        else if (path.pathname.includes('user')) {
            setValue('account')
        }

    }, [])

    const darkTheme = createTheme({
        palette: {
            mode: theme ? 'light' : 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // console.log(path.pathname);


    return (
        <>
            <ThemeProvider theme={darkTheme}>

                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>

                    <BottomNavigation sx={{ width: 500, display: { xs: 'flex', md: 'none' } }} value={value} onChange={handleChange}>
                        <BottomNavigationAction
                            onClick={() => history('/')}
                            label="Home"
                            value="home"
                            icon={<HomeIcon />}
                        />
                        <BottomNavigationAction
                            onClick={() => history('/create')}
                            label="Create a blog"
                            value="create"
                            icon={<AddCircleIcon />}
                        />
                        <BottomNavigationAction
                            onClick={() => history(`/user/${loggedinUser?.profile?.user}`)}
                            label={loggedinUser?.profile?.username}
                            value="account"
                            icon={
                                <UserAvatar src={loggedinUser?.profile?.Profile_pic} name={loggedinUser?.profile?.username ?? 'User'} />
                            }
                        />
                        <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
                    </BottomNavigation>
                </Paper>
            </ThemeProvider>
        </>
    )
}
