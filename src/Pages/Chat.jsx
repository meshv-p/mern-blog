import { CssBaseline, Grid } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { ChatScreen } from '../Compo/ChatScreen'
import { LeftSideBar } from '../Compo/LeftSideBar'
import { useConversations } from '../Context/ConversatioinsProvider'
import { useSocket } from '../Context/socketProider'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import blogContext from '../Context/BlogContext'
import { AlertBar } from '../Compo/Alert'
import {useNavigate} from "react-router-dom";

export const Chat = () => {
    const [open, setOpen] = useState(true)
    const context = useContext(blogContext);
    setTimeout(() => {
        setOpen(false)
    }, 2000);
    let { theme, } = context;
    let user = JSON.parse(localStorage.getItem('user'))
    let data = user?.profile.following;
    let history = useNavigate()

    useEffect(()=>{
        console.log(user)
        if(user === null){
            history('/login');
        }
    },[])

    // let data = {
    //     users: [
    //         {
    //             name: 'meshvp',
    //             id: '6245c68299b2268d8bccc47f',
    //             friends: [
    //                 {
    //                     name: 'maanp',
    //                     lastMsg: 'Hey',
    //                     lastMsgTime: '1 min ago',
    //                     id: '6245c68299b2268d8bccc47f'
    //                 },
    //             ]
    //         },
    //         {
    //             name: 'maanp',
    //             friends: [
    //                 {
    //                     name: 'Meshv',
    //                     lastMsg: 'Hey',
    //                     lastMsgTime: '10 min ago',
    //                     id: '6245c9a799b2268d8bccc49e'
    //                 },
    //             ],
    //             id: '6245c9a799b2268d8bccc49e'

    //         },
    //         {
    //             name: 'abc',
    //             friends: [
    //                 {
    //                     name: 'Meshv',
    //                     lastMsg: 'Hey',
    //                     lastMsgTime: '10 min ago',
    //                     id: '6245cdd699b2268d8bccc4d0'
    //                 },
    //             ],
    //             id: '6245cdd699b2268d8bccc4d0'

    //         },
    //     ],

    // }
    const darkTheme = createTheme({
        palette: {
            mode: theme ? 'light' : 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });


    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                {/* make layout like whatsapp */}
                {
                    user &&
                    <Grid container>
                        <AlertBar open={open} msg="Follow more user to chat with them" type='info'/>

                        <Grid item xs={2} sx={{height: '91vh', overflow: 'auto'}} className='hey'>

                            <LeftSideBar data={data}/>

                        </Grid>
                        <Grid item xs={10}>


                            <ChatScreen data={data}/>

                        </Grid>


                    </Grid>
                }
            </ThemeProvider>
        </>
    )
}
