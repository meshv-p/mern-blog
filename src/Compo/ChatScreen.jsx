import { Box, Button, Card, CardHeader, IconButton, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../Context/socketProider'
import { UserAvatar } from './UserAvatar'
import { useConversations } from '../Context/ConversatioinsProvider'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { timeAgo } from '../utils/timeAgo'

export const ChatScreen = ({ data: user }) => {
    const [message, setMessage] = React.useState('')
    const [header, setHeader] = useState(null);
    let currentUser = JSON.parse(localStorage.getItem('user'))
    let { selectedUser, messages, setMessages, selectedUserData, setSelectedUserData, unread, setUnread, db } = useConversations()
    let Cuser = JSON.parse(localStorage.getItem('user'))
    const setRef = useCallback(node => {
        if (node) {
            node.scrollIntoView({ smooth: true })
        }
    }, [])

    let socket = useSocket();
    useEffect(() => {
        setSelectedUserData(user[selectedUser]);

        fetch(`${process.env.REACT_APP_URL}/api/v1/chats/`, {
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
        if (message.length < 0 || message === '') return;
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
        window.scrollTo(0, document.body.scrollHeight);
        setMessage('')
    }

    useEffect(() => {

        // //save message to database
        // let db;
        // const request = window.indexedDB.open("chat-messages");
        // request.onerror = event => {
        //     console.log("Why didn't you allow my web app to use IndexedDB?!");
        // };
        // request.onsuccess = event => {
        //     db = event.target.result;
        //     console.log(event);

        // };

        // This is what our customer data looks like.
        const customerData = [
            { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
            { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
        ];

        const dbName = "the_name";

        var request = indexedDB.open(dbName, 2);

        request.onerror = event => {
            // Handle errors.
        };
        request.onupgradeneeded = event => {
            var db = event.target.result;

            // Create an objectStore to hold information about our customers. We're
            // going to use "ssn" as our key path because it's guaranteed to be
            // unique - or at least that's what I was told during the kickoff meeting.
            var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

            // Create an index to search customers by name. We may have duplicates
            // so we can't use a unique index.
            objectStore.createIndex("name", "name", { unique: false });

            // Create an index to search customers by email. We want to ensure that
            // no two customers have the same email, so use a unique index.
            objectStore.createIndex("email", "email", { unique: true });

            // Use transaction oncomplete to make sure the objectStore creation is
            // finished before adding data into it.
            objectStore.transaction.oncomplete = event => {
                // Store values in the newly created objectStore.
                var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
                customerData.forEach(function (customer) {
                    customerObjectStore.add(customer);
                });
            };
        };




        if (socket === null) return
        socket?.on('receive-msg', (msg) => {
            console.log(selectedUserData);
            console.log(selectedUserData._id === msg.sender);



            if (selectedUserData._id === msg.sender) {

                setMessages([...messages, msg])
            }
            else {
                //update the information about unread messages with user Id
                // //count the number of unread messages from upcoming messages
                setUnread([...unread, msg.sender])
            }
            // setSelectedUser(user.findIndex(u => u.name === msg.sender))
        })

        // receving typing event
        socket?.on('typing', (data) => {
            console.log(data);
            if (selectedUserData._id === data.sender) {
                setHeader('Typing...')
            }
        })

        socket?.on('stop-typing', (data) => {
            console.log(data);
            if (selectedUserData._id === data.sender) {
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
            'to': user[selectedUser]._id,
            'time': Date().toString,
            'fromMe': true
        })
    }

    const handleDone = () => {
        socket.emit('stop-typing', {
            'sender': currentUser.profile._id,
            'to': user[selectedUser]._id,
            'time': Date().toString,
            'fromMe': true
        })
    }


    return (
        <Box sx={{ borderTop: 1, borderLeft: 1, borderColor: 'silver', height: '100%', display: 'grid', gridTemplateRows: 'auto 1fr auto' }}>
            {/* <Stack> */}
            {/* Chat header */}
            <Box sx={{ bgcolor: 'background.paper', border: '0 1 1 1' }}>
                <Card>
                    <CardHeader
                        avatar={<UserAvatar src={user[selectedUser]?.Profile_pic} name={user[selectedUser]?.username} />}
                        title={user[selectedUser]?.username}
                        subheader={header || user[selectedUser]?.email}
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
            <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', flexGrow: '1', overflow: 'auto', maxHeight: '70vh' }}>
                {
                    messages.map((msg, index) => {
                        const lastMessage = messages.length - 1 === index

                        return (
                            // <List sx={{ width: 'min-content', borderRadius: 1, bgcolor: 'background.paper', border: 1, alignContent: 'end', justifyContent: 'right', display: 'flex' }}>
                            <React.Fragment key={index}>
                                <ListItem
                                    ref={lastMessage ? setRef : null}

                                    selected sx={{ width: 'max-content', m: .4, borderRadius: 2 }} style={{ alignSelf: msg.sender === Cuser.profile._id ? 'end' : 'start' }}
                                >

                                    <ListItemText >{msg.message}
                                    </ListItemText>
                                </ListItem>
                                <Typography color='silver' variant="caption" display="block" gutterBottom style={{ alignSelf: msg.sender === Cuser.profile._id ? 'end' : 'start' }}>

                                    {timeAgo(msg.createdAt || new Date())}
                                </Typography>
                            </React.Fragment>
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
            <Box sx={{ p: 1, bgcolor: 'background.paper', borderTop: 1, borderColor: 'silver' }}>
                <form onSubmit={handleSubmit} >
                    <Stack direction='row'>
                        {/* make an event to capture on typing */}
                        <TextField sx={{ flexGrow: 1 }} id="msg" onChange={e => handleTyping(e.target.value)} value={message} label="Message" variant="filled" placeholder='Send a message'
                            // onKeyPress={handleTyping}
                            onBlur={handleDone}
                            // onKeyUp
                            required={true}
                        />
                        <Button variant="contained" onClick={handleSubmit}  >Send</Button>
                    </Stack>
                </form>

            </Box>

            {/* </Stack> */}
        </Box>
    )
}
