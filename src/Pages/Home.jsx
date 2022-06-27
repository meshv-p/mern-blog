import { Container, CssBaseline } from '@mui/material'
import React, { useState, useContext, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import blogContext from '../Context/BlogContext';
import { Blog } from '../Compo/Blog';
import { Spinner } from '../Compo/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Alert, AlertBar } from '../Compo/Alert';
import { NetworkStatus } from '../Compo/NetworkStatus';
import { Head } from '../Compo/Head';
export const Home = () => {
    const [allBlogs, setAllBlogs] = useState([]);

    const [isLoading, setIsLoading] = useState(false)
    const [pageNo, setPageNo] = useState(1)
    const [totalPage, setTotalPage] = useState(null)
    const context = useContext(blogContext)
    const [open, setOpen] = useState(false)
    let { theme, url, setProgress, userIsOnline, setUserIsOnline } = context;
    const darkTheme = createTheme({
        palette: {
            mode: theme ? 'light' : 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });

    useEffect(() => {
        setOpen(true)
        setIsLoading(true)
        fetchData()

        return () => {
            console.clear()
        }
    }, [])







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
                    <Head title='Dev Blog' />

                    <React.Suspense fallback={<Spinner />}>
                        {
                            !userIsOnline && <NetworkStatus />
                        }
                        {
                            userIsOnline && allBlogs &&

                            <InfiniteScroll
                                dataLength={allBlogs.length} //This is important field to render the next data
                                next={fetchData}
                                hasMore={allBlogs.length !== totalPage}
                                loader={<Spinner />}
                                // loader='loading...'
                                pullDownToRefreshContent={
                                    <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                                }
                                releaseToRefreshContent={
                                    <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                                }
                            >

                                {allBlogs.map((blog, index) => (
                                    <Blog blog={blog} key={blog._id} theme={theme} index={index} />
                                ))}
                            </InfiniteScroll>
                        }
                    </React.Suspense>

                </Container>
            </ThemeProvider>
        </div>
    )
}
