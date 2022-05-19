import React, { useContext, useEffect, useState } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { Badge, ListItemButton, Paper } from '@mui/material';
import { useFetch } from '../hooks/useFetch';
import { UserAvatar } from './UserAvatar';
import styled from '@emotion/styled';
import blogContext from '../Context/BlogContext';
export const UsersList = () => {
    const context = useContext(blogContext);
    let { theme, toggleTheme, loggedinUser, userNotification, socketState: socket } = context;

    const [users, setUsers] = useState([])
    const [onlineUser, setOnlineUser] = useState([])
    let { data, error, isLoading } = useFetch('http://localhost:5000/api/v1/users/', 'allUser')

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
                transform: 'scale(.8)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
    }));


    useEffect(() => {

        socket.on('online', async (onlineUser) => {
            console.log(onlineUser)
            onlineUser?.map(item => console.log(item.user._id, item.user._id === loggedinUser?.profile._id))
            // // console.log('online run ', user);
            // await onlineUser?.filter(item => item.user._id !== loggedinUser?.profile._id)
            await console.log('after filer', onlineUser)
            setOnlineUser(onlineUser)
        })


    }, [onlineUser])


    return (
        <div>
            <Paper>
                <List sx={{ width: '100%', border: 1, bgcolor: 'background.paper' }} id="list">

                    {
                        onlineUser && onlineUser?.map(user =>
                        (
                            <ListItemButton key={user?.user?._id}>
                                <ListItemAvatar>
                                    <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                    >
                                        <UserAvatar src={user?.user?.Profile_pic} name={user?.user?.username} />

                                    </StyledBadge>
                                </ListItemAvatar>
                                <ListItemText primary={user?.user?.username} secondary="Jan 9, 2014" />
                            </ListItemButton>
                        ))
                    }

                    {/* {
                        data && data?.allUser?.map(user => (
                            <ListItemButton key={user._id}>
                                <ListItemAvatar>
                                    <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                    >
                                        <UserAvatar src={user.Profile_pic} name={user.username} />

                                    </StyledBadge>
                                </ListItemAvatar>
                                <ListItemText primary={user.username} secondary="Jan 9, 2014" />
                            </ListItemButton>
                        ))
                    } */}



                </List>
            </Paper>
        </div>
    )
}
