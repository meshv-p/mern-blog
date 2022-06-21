import { Box, Button, Card, CardHeader, IconButton, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSocket } from '../Context/socketProider'
import { UserAvatar } from './UserAvatar'
import { useConversations } from '../Context/ConversatioinsProvider'
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const ChatScreen = ({ data: user }) => {
    const [message, setMessage] = React.useState('')
    let currentUser = JSON.parse(localStorage.getItem('user'))
    let { selectedUser, setSelectedUser, messages, setMessages, setSelectedUserData, selectedUserData } = useConversations()
    let Cuser = JSON.parse(localStorage.getItem('user'))

    let socket = useSocket();
    useEffect(() => {
        // setSelectedUserData(user[selectedUser]);

        fetch(`http://localhost:5000/api/v1/chats/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: Cuser.profile._id,
                receiver: Cuser.profile.following[selectedUser]?._id
            })
        }).then(res => res.json()).then(data => setMessages(data))

    }, [selectedUser])
    // send msg to socket eith event 'send-message'
    const handleSubmit = (e) => {
        console.log(message);
        e.preventDefault()
        let s = {
            'sender': currentUser.profile._id,
            'message': message,
            'to': user[selectedUser]._id,
            'time': Date().toString,
            'fromMe': true
        }
        console.log(s);
        socket.emit('send-msg', s)
        setMessages([...messages, s])
        setMessage('')
    }

    useEffect(() => {
        if (socket === null) return
        socket?.on('receive-msg', (msg) => {
            console.log(selectedUserData._id === msg.sender);
            if (selectedUserData._id === msg.sender) {

                setMessages([...messages, msg])
            }
            // setSelectedUser(user.findIndex(u => u.name === msg.sender))
        })
    }, [messages, socket])


    return (
        <Box sx={{ border: 1, height: '100%' }}>
            <Stack>
                {/* Chat header */}
                <Box sx={{ bgcolor: 'background.paper', border: 1 }}>
                    <Card>
                        <CardHeader
                            avatar={<UserAvatar src={user?.Profile_pic} name={user[selectedUser]?.username} />}
                            title={user[selectedUser]?.username}
                            subheader={user[selectedUser]?.email}
                            action={<IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>}
                        />
                    </Card>
                    {/* <Box sx={{ px: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mr: 3 }}>
                                <UserAvatar src={user?.Profile_pic} name={user[selectedUser]?.username} />
                            </Box>
                            <Box>
                                <Typography variant='h6'>{user[selectedUser]?.username}</Typography>
                                <Typography variant='body2'>{user[selectedUser]?.email || user[selectedUser]?.createdAt}</Typography>
                            </Box>
                        </Box>
                    </Box> */}
                </Box>
                {/* Chat body */}
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                    {
                        messages.map((msg, index) => {
                            return (
                                // <List sx={{ width: 'min-content', borderRadius: 1, bgcolor: 'background.paper', border: 1, alignContent: 'end', justifyContent: 'right', display: 'flex' }}>
                                <ListItem selected sx={{ width: 'max-content', m: .4, borderRadius: 2 }} style={{ alignSelf: msg.sender === Cuser.profile._id ? 'end' : 'start' }} key={index}>

                                    <ListItemText >{msg.message}</ListItemText>
                                </ListItem>
                                // </List>
                            )
                        })

                    }
                    {/* // <List sx={{ width: 'min-content', borderRadius: 1, bgcolor: 'background.paper', border: 1, alignContent: 'end', justifyContent: 'right', display: 'flex' }}>
                    //     <ListItem selected>

                    //         <ListItemText >Hey</ListItemText>
                    //     </ListItem>
                    // </List>
                    // <List sx={{ margin: 'auto', width: 'min-content', borderRadius: 1, bgcolor: 'background.paper', border: 1, alignContent: 'start', justifyContent: 'left', display: 'flex' }}>
                    //     <ListItem selected>

                    //         <ListItemText >Hey</ListItemText>
                    //     </ListItem>
                    // </List> */}
                </Box>


                {/* bottom input bar  */}
                <Box sx={{ p: 1, width: '100%', bgcolor: 'background.paper', border: 1, position: 'fixed', bottom: 0 }}>
                    <Stack direction='row'>
                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>

                            <TextField sx={{ width: '70%' }} id="msg" onChange={e => setMessage(e.target.value)} value={message} label="Message" variant="filled" placeholder='Send a message' />
                            <Button variant="contained" onClick={handleSubmit}  >Send</Button>
                        </form>

                    </Stack>
                </Box>

            </Stack>
        </Box>
    )
}
