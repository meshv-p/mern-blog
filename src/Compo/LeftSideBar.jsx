import { Badge, Box, ListItemButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { UserAvatar } from './UserAvatar'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useConversations } from '../Context/ConversatioinsProvider';
import { useSocket } from '../Context/socketProider';
import styled from '@emotion/styled';

export const LeftSideBar = ({ data: users }) => {
    let { selectedUser, setSelectedUser, onlineU, setOnlineU } = useConversations()
    let socket = useSocket();

    useEffect(() => {
        //online users
        socket?.on('online', (data) => {
            console.log(data, socket);
            setOnlineU(data.onlineUser)
        })
        // offline users
        socket?.on('offline', (data) => {
            console.log(data, socket.id);
            //filter out the user that is offline
            let newOnlineU = onlineU.filter(user => user !== data)
            setOnlineU(newOnlineU)
            console.log(newOnlineU)
            // setOnlineU(data)
        })
        return () => {
            socket?.off('online')
            socket?.off('offline')
        }
    }, [socket, onlineU])
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






    function checkOnlineUser(arr, userId) {
        return arr?.find(u => u.id === userId)
    }

    return (
        <Box sx={{ border: 1 }} height='100vh'>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {
                    users &&
                    users?.map((user, index) => {
                        return (
                            <React.Fragment key={index}>
                                <ListItemButton selected={selectedUser === index} onClick={() => setSelectedUser(index)}>
                                    <ListItem alignItems="flex-start" key={index}>
                                        <ListItemAvatar>
                                            <StyledBadge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                // variant={checkOnlineUser(onlineU, user._id) ? 'dot' : 'standard'}
                                                variant={onlineU?.find(u => u.id === user._id) ? 'dot' : 'standard'}
                                            >
                                                <UserAvatar src={user.Profile_pic} name={user.username} />

                                            </StyledBadge>
                                            {/* <UserAvatar src={user?.user?.Profile_pic} name={user?.user?.username} /> */}
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={user.username}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="textPrimary"
                                                    >
                                                        {/* get time  */}
                                                        {(user.createdAt).slice(0, 10)}

                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                </ListItemButton>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        )
                    })
                }
                {/* // <ListItem alignItems="flex-start" selected>
                //     <ListItemAvatar>
                //         <UserAvatar src='image.png' name='Me' />
                //     </ListItemAvatar>
                //     <ListItemText
                //         primary="User Name"
                //         secondary={
                //             <React.Fragment>
                //                 <Typography
                //                     sx={{ display: 'inline' }}
                //                     component="span"
                //                     variant="body2"
                //                     color="text.primary"
                //                 >
                //                     Last msg
                //                 </Typography>
                //                 {" — I'll be in..."}
                //             </React.Fragment>
                //         }
                //     />
                // </ListItem>
                // <Divider variant="inset" component="li" /> */}
            </List>
        </Box>
    )
}
