import {
    Box,
    Button,
    Card,
    CardHeader,
    IconButton,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../Context/socketProider'
import { UserAvatar } from './UserAvatar'
import { useConversations } from '../Context/ConversatioinsProvider'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { timeAgo } from '../utils/timeAgo'
import { Spinner } from "./Spinner";
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { useMediaQuery } from '../hooks/useMediaQuery'

export const ChatScreen = () => {
    const [message, setMessage] = React.useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [header, setHeader] = useState(null);
    let { userInfo } = useParams()
    let currentUser = JSON.parse(localStorage.getItem('user'))
    let {
        selectedUser,
        messages,
        setMessages,
        selectedUserData,
        unread,
        setUnread,
    } = useConversations()
    let Cuser = JSON.parse(localStorage.getItem('user'))
    const setRef = useCallback(node => {
        if (node) {
            node.scrollIntoView({ smooth: true })
        }
    }, [])

    let socket = useSocket();
    let history = useNavigate();
    let { isLaptop } = useMediaQuery()
    // let { isLaptop } = useMediaQuery((theme) => theme.breakpoints.up('sm'));

    useEffect(() => {
        // setSelectedUserData(user[selectedUser]);
        // fetchAllChats()
        setIsLoading(true)

        let receiverId = userInfo ?? Cuser.profile.following[selectedUser]?._id

        fetch(`${process.env.REACT_APP_URL}/api/v1/chats/friend/${receiverId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: Cuser.profile._id,
                receiver: receiverId
            })
        }).then(res => res.json()).then(data => {
            setIsLoading(false)
            setMessages(data)
        })
        // },[selectedUser])
        readAllSMS()

    }, [selectedUser])


    // retrieve messages according to user
    const readAllSMS = async () => {
        // let cache = {}
        // useMemo(()=>{
        fetch(`${process.env.REACT_APP_URL}/api/v1/chats/friend/${Cuser.profile.following[selectedUser]?._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: Cuser.profile._id,
                receiver: Cuser.profile.following[selectedUser]?._id
            })
        })
            .then(res =>
                res.json()
            ).then(data => console.log(data))


    }

    // send msg to socket eith event 'send-message'
    const handleSubmit = (e) => {
        if (message.length < 0 || message === '') return;
        // console.log(message);
        e.preventDefault()
        let s = {
            'sender': currentUser.profile._id,
            'message': message,
            'to': selectedUserData._id,
            'time': Date().toString,
            'fromMe': true
        }
        console.log(s);
        socket.emit('send-msg', s)
        setMessages([...messages, s])
        window.scrollTo(0, document.body.scrollHeight);
        setMessage('')
    }

    useEffect(() => {
        if (socket === null) return
        socket?.on('receive-msg', (msg) => {
            console.log(selectedUserData);
            console.log(selectedUserData?._id === msg.sender);


            if (selectedUserData?._id === msg.sender) {

                setMessages([...messages, msg])
            } else {
                //update the information about unread messages with user Id
                // //count the number of unread messages from upcoming messages
                setUnread([...unread, msg.sender])
            }
            // setSelectedUser(user.findIndex(u => u.name === msg.sender))
        })

        // receving typing event
        socket?.on('typing', (data) => {
            // console.log(data);
            if (selectedUserData?._id === data.sender) {
                setHeader('Typing...')
            }
        })

        socket?.on('stop-typing', (data) => {
            // console.log(data);
            if (selectedUserData?._id === data.sender) {
                setHeader(null)
            }
        })
    }, [messages, socket])

    // send typing event to socket with event 'typing'
    const handleTyping = (data) => {
        setMessage(data)

        // e.preventDefault()
        socket.emit('typing', {
            'sender': currentUser.profile._id,
            'to': selectedUserData._id,
            'time': Date().toString,
            'fromMe': true
        })
    }

    const handleDone = () => {
        socket.emit('stop-typing', {
            'sender': currentUser.profile._id,
            'to': selectedUserData?._id,
            'time': Date().toString,
            'fromMe': true
        })
    }


    return (

        <>

            {selectedUserData._id ?
                <Box sx={{ borderColor: 'silver', height: '100%', display: 'grid', gridTemplateRows: 'auto 1fr auto' }}>
                    {/* <Stack> */}
                    {/* Chat header */}
                    <Box sx={{ bgcolor: 'background.paper', border: '0 1 1 1' }}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <Stack direction="row" gap={2}>

                                        {!isLaptop && <IconButton onClick={() => {
                                            history(-1)
                                        }}>
                                            <ArrowBackIosRoundedIcon />
                                        </IconButton>}
                                        <UserAvatar src={selectedUserData?.Profile_pic}
                                            name={selectedUserData?.username ?? 'User'} />
                                    </Stack>
                                }
                                title={selectedUserData?.username}
                                subheader={header || selectedUserData?.email}
                                action={<IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>}
                            />
                        </Card>

                    </Box>
                    {/* Chat body */}
                    <Box sx={{
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: '1',
                        overflow: 'auto',
                        maxHeight: '70vh'
                    }}>
                        {
                            isLoading ? <Spinner /> :
                                messages?.map((msg, index) => {
                                    const lastMessage = messages.length - 1 === index

                                    return (
                                        // <List sx={{ width: 'min-content', borderRadius: 1, bgcolor: 'background.paper', border: 1, alignContent: 'end', justifyContent: 'right', display: 'flex' }}>
                                        <React.Fragment key={index}>
                                            <ListItem
                                                ref={lastMessage ? setRef : null}
                                                selected sx={{ width: 'max-content', m: .4, borderRadius: 2 }}
                                                style={{
                                                    alignSelf: msg.sender === Cuser.profile._id ? 'end' : 'start',
                                                    background: (msg.sender === Cuser.profile._id) !== true && 'transparent',
                                                    color: (msg.sender !== Cuser.profile._id) && 'rgb(25 118 210 / 95%)',
                                                    border: '1px solid rgb(25 118 210 / 76%)',
                                                    maxWidth: '244px',
                                                    msWordBreak: 'break-word',
                                                }}
                                            >

                                                <ListItemText primary={msg.message}
                                                    secondary={
                                                        msg.sender === Cuser.profile._id &&
                                                        <Stack direction='row' alignItems='center' gap={1}>
                                                            <Typography fontSize='10px'>
                                                                {/* {timeAgo(msg.createdAt || new Date())} */}
                                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}

                                                            </Typography>
                                                            <Typography color={msg.hasUserRead ? 'green' : ""}
                                                                align='right' fontSize='10px'>
                                                                ✔✔
                                                            </Typography>
                                                        </Stack>
                                                    }


                                                />

                                            </ListItem>
                                            <Typography color='silver' variant="caption" display="block" gutterBottom
                                                style={{ alignSelf: msg.sender === Cuser.profile._id ? 'end' : 'start' }}>

                                                {timeAgo(msg.createdAt || new Date())}
                                            </Typography>
                                        </React.Fragment>
                                    )
                                })

                        }
                    </Box>


                    {/* bottom input bar  */}
                    <Box sx={{ p: 1, bgcolor: 'background.paper', borderTop: 1, borderColor: 'silver' }}>
                        <form onSubmit={handleSubmit}>
                            <Stack direction='row'>
                                {/* make an event to capture on typing */}
                                <TextField sx={{ flexGrow: 1 }} id="msg" onChange={e => handleTyping(e.target.value)}
                                    value={message} label="Message" variant="filled" placeholder='Send a message'
                                    // onKeyPress={handleTyping}
                                    onBlur={handleDone}
                                    // onKeyUp
                                    required={true}
                                />
                                <Button variant="contained" onClick={handleSubmit}>Send</Button>
                            </Stack>
                        </form>

                    </Box>

                    {/* </Stack> */}
                </Box>
                :
                <Box sx={{
                    borderTop: 1,
                    borderLeft: 1,
                    borderColor: 'silver',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Typography align='center' alignSelf='center' variant='h6' color='primary'>
                        Select a chat to start conversion. {selectedUserData?.username}
                    </Typography>
                </Box>}
        </>
    )
}