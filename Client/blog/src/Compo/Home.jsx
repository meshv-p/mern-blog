import { Container, CssBaseline } from '@mui/material'
import React, { useState, useContext, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import blogContext from '../Context/BlogContext';
import { Blog } from './Blog';
import { Spinner } from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Alert, AlertBar } from './Alert';
// import { io } from 'socket.io-client'
export const Home = () => {

    const [allBlogs, setAllBlogs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [pageNo, setPageNo] = useState(1)
    const [totalPage, setTotalPage] = useState(null)
    const context = useContext(blogContext)
    const [open, setOpen] = useState(false)
    let { theme, url, socketState: socket, setProgress, loggedinUser } = context;
    const darkTheme = createTheme({
        palette: {
            mode: theme ? 'light' : 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });

    useEffect(() => {
        // socket.on('welcome', sms => {
        //     console.log(sms)
        // })
        // socket.emit('welcome', 'meshv')

        // console.log(socket)
        setOpen(true)
        setIsLoading(true)
        fetchData()
        // setOpen(false)
        console.log(navigator.onLine ? 'you are online' : 'you are offline')

    }, [])


    useEffect(() => {

        if (loggedinUser) {
            // console.log('loggin')

            socket.on('connect', () => {
                console.log('connect', socket.id)
                socket.emit('online', {
                    user: loggedinUser?.profile,
                    socket_user_id: socket.id
                })
            })
        }
        socket.on("disconnect", () => {
            // console.log(socket.id, 'offline'); // undefined
        });


    }, [loggedinUser, socket])


    const fetchData = () => {
        setProgress(10)
        fetch(`${url}/api/v1/blogs/?page=${pageNo}`).then(res => res.json()).then(data => {
            // fetch(`${url}/api/v1/blogs`).then(res => res.json()).then(data => {
            setAllBlogs(allBlogs?.concat(data.allBlogs))
            setTotalPage(data.length)
            setIsLoading(false);
            setOpen(false)
        })
        setProgress(100)
        setPageNo(pageNo + 1)
    }




    return (
        <div >

            <ThemeProvider theme={darkTheme}>
                <AlertBar open={open} msg="Loading..." type='info' />

                <Container sx={{ pt: 2 }}>
                    <CssBaseline />
                    {
                        isLoading && <Spinner />
                    }
                    {
                        allBlogs &&

                        <InfiniteScroll
                            dataLength={allBlogs.length} //This is important field to render the next data
                            next={fetchData}
                            hasMore={allBlogs.length !== totalPage}
                            loader={<Spinner />}
                            pullDownToRefreshContent={
                                <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                            }
                            releaseToRefreshContent={
                                <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                            }
                        >

                            {allBlogs.map(blog => (
                                <Blog blog={blog} key={blog._id} theme={theme} />
                            ))}
                        </InfiniteScroll>
                    }

                </Container>
            </ThemeProvider>
        </div>
    )
}
