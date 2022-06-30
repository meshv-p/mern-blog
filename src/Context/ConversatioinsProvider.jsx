import React, { useContext, useEffect, useState } from 'react'
import { useSocket } from './socketProider'

const ConversationsContext = React.createContext()

export function useConversations() {
    return useContext(ConversationsContext)
}


export const ConversatioinsProvider = ({ children }) => {
    let user = JSON.parse(localStorage.getItem('user')) || []
    const [selectedUser, setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [selectedUserData, setSelectedUserData] = useState({})
    const [onlineU, setOnlineU] = useState([])
    //for unread messages
    const [unread, setUnread] = useState([])
    let socket = useSocket()
    //create a new indexDb database for chat messages according to the user id
    let db = indexedDB.open('chat-messages', 1)

    // //on socket save message to database
    // socket.on('receive-msg', (msg) => {
    //     console.log(msg);
    //     let s = {
    //         'sender': msg.sender,
    //         'message': msg.message,
    //         'to': msg.to,
    //         'time': msg.time,
    //         'fromMe': false
    //     }
    //     setMessages([...messages, s])
    //     //save message to database
    //     db.onsuccess = (e) => {
    //         let db = e.target.result
    //         let tx = db.transaction('chat-messages', 'readwrite')
    //         let store = tx.objectStore('chat-messages')
    //         store.add(s)
    //     }
    // })


    // useEffect(() => {
    //     console.log(selectedUser)
    //     setSelectedUserData(user?.profile?.following[selectedUser])
    //     console.log(selectedUserData)

    // }, [selectedUser])


    useEffect(() => {
        //online users
        socket?.on('online', (data) => {
            // console.log(data, socket);
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
    }, [socket])


    return (
        <ConversationsContext.Provider value={{ db, unread, setUnread, onlineU, setOnlineU, selectedUser, setSelectedUser, messages, setMessages, selectedUserData, setSelectedUserData }}>
            {children}
        </ConversationsContext.Provider>
    )
}
