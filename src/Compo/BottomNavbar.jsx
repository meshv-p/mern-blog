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
                                <Avatar sx={{ width: 24, height: 24 }} src={loggedinUser?.profile?.Profile_pic} alt="Username" {...stringAvatar(loggedinUser?.profile?.username ? loggedinUser.profile.username : 'meshv')} />
                            }
                        />
                        <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
                    </BottomNavigation>
                </Paper>
            </ThemeProvider>
        </>
    )
}
