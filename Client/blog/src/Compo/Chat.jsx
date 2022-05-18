import React, { useContext, useEffect } from 'react'
import blogContext from '../Context/BlogContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Grid } from '@mui/material';
import { UsersList } from './UsersList';
import { ChatMessage } from './ChatMessage';

export const Chat = () => {
    const context = useContext(blogContext);
    let { theme, toggleTheme, loggedinUser, progress, userNotification, socketState: socket } = context;
    useEffect(() => {
        socket.emit('smg', 'hey all')


        socket.on('smg', sms => {
            console.log(sms)
        })

        return () => {
            socket.off('smg')
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

    return (
        <>
            <ThemeProvider theme={darkTheme}>

                <CssBaseline />
                <Grid container>
                    <Grid item xs={3}>
                        <UsersList />
                    </Grid>
                    <Grid item xs={9}>
                        <ChatMessage />
                        {/* sa */}
                    </Grid>
                </Grid>
            </ThemeProvider>
        </>
    )
}
