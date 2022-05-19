import { Container, CssBaseline } from '@mui/material'
import React, { useState, useContext, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import blogContext from '../Context/BlogContext';
import { Blog } from './Blog';
import { Spinner } from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Alert, AlertBar } from './Alert';
import { useDispatch, useSelector } from 'react-redux';
import { useGetBlogsQuery } from '../features/apiSlice';
import { addBlog, getBlogs } from '../features/blogStateSlice';
// import { io } from 'socket.io-client'
export const Home = () => {

    const [allBlogs, setAllBlogs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [pageNo, setPageNo] = useState(1)
    // const [totalPage, setTotalPage] = useState(null)
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


    let {
        data,
        isLoading: load,
        isSuccess,
        isError,
        error } = useGetBlogsQuery;

    let blog = useSelector(state => state.blog.blog)
    let totalPage = useSelector(state => state.blog.totalPage)
    let dispatch = useDispatch()

    useEffect(() => {

        console.log(blog.length, totalPage, 'for loading')
        setOpen(true)
        setIsLoading(true)
        if (totalPage === 0) fetchData()

        if (blog.length < (totalPage)) {
            fetchData()
        }
        // load && setProgress(10)
        console.log(navigator.onLine ? 'you are online' : 'you are offline')
        if (error) return <div>{error}</div>

    }, [])


    useEffect(() => {

        if (!load && isSuccess) {
            setAllBlogs(allBlogs.concat(data.allBlogs))
        }
    }, [isSuccess])

    useEffect(() => {

        console.log(blog.length, totalPage, 'for loading')

    }, [blog, totalPage])




    const fetchData = async () => {
        setProgress(10)
        // fetch(`${url}/api/v1/blogs/?page=${pageNo}`).then(res => res.json()).then(data => {
        //     // fetch(`${url}/api/v1/blogs`).then(res => res.json()).then(data => {
        //     setAllBlogs(allBlogs?.concat(data.allBlogs))
        //     setIsLoading(false);
        //     setOpen(false)
        // })
        // setProgress(100)
        // setAllBlogs([...data.allBlogs, data.allBlogs])
        setPageNo(pageNo + 1)
        dispatch(getBlogs(pageNo))
        setProgress(100)

    }




    return (
        <div >

            <ThemeProvider theme={darkTheme}>
                <AlertBar open={load} msg="Loading..." type='info' />

                <Container sx={{ pt: 2 }}>
                    <CssBaseline />
                    {
                        load && <Spinner />
                    }
                    {
                        blog.length !== 0 &&

                        <InfiniteScroll
                            dataLength={blog.length} //This is important field to render the next data
                            next={fetchData}
                            hasMore={blog.length !== totalPage}
                            loader={<Spinner />}
                            pullDownToRefreshContent={
                                <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                            }
                            releaseToRefreshContent={
                                <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                            }
                        >

                            {blog && blog.map((blog, index) => (
                                <Blog blog={blog} key={index} theme={theme} />
                            ))}
                        </InfiniteScroll>
                    }

                </Container>
            </ThemeProvider>
        </div>
    )
}
