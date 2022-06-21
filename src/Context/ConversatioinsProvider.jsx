import React, { useContext, useEffect, useState } from 'react'
import { useSocket } from './socketProider'

const ConversationsContext = React.createContext()

export function useConversations() {
    return useContext(ConversationsContext)
}


export const ConversatioinsProvider = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState(0)
    const [messages, setMessages] = React.useState([])
    const [selectedUserData, setSelectedUserData] = useState(null)
    const [onlineU, setOnlineU] = useState([])
    let socket = useSocket()
    let user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        console.log(selectedUser)
        setSelectedUserData(user.profile.following[selectedUser])
        console.log(selectedUser)

    }, [])


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
    }, [socket])


    return (
        <ConversationsContext.Provider value={{ onlineU, setOnlineU, selectedUser, setSelectedUser, messages, setMessages, selectedUserData, setSelectedUserData }}>
            {children}
        </ConversationsContext.Provider>
    )
}
