import { Container, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ChatScreen } from '../Compo/ChatScreen'
import { LeftSideBar } from '../Compo/LeftSideBar'
import { AlertBar } from '../Compo/Alert'
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from '../hooks/useMediaQuery'

export const Chat = () => {
    const [open, setOpen] = useState(true)
    let { isLaptop } = useMediaQuery()
    // let isMobile = useMediaQuery((theme) => theme.breakpoints.up('sm'));

    setTimeout(() => {
        setOpen(false)
    }, 2000);
    let user = JSON.parse(localStorage.getItem('user'))
    let data = user?.profile.following;
    let history = useNavigate()

    useEffect(() => {
        // console.log(user)
        if (user === null) {
            history('/login');
        }
        // console.log(isLaptop);
    }, [isLaptop])


    return (
        <>
            <AlertBar open={open} msg="Follow more user to chat with them" type='info' />
            {/* {isMobile} */}
            {/* make layout like whatsapp */}
            {
                !isLaptop ?
                    <Container fixed >
                        <Grid container>
                            <Grid item xs={12}>
                                <LeftSideBar data={data} />
                            </Grid>
                        </Grid>
                    </Container> :


                    (user &&
                        <Grid container>

                            <Grid item xs={3} sx={{ height: '91vh', overflow: 'auto' }} className='hey'>

                                <LeftSideBar data={data} />

                            </Grid>
                            <Grid item xs={9}>


                                <ChatScreen />

                            </Grid>


                        </Grid>)
            }
        </>
    )
}