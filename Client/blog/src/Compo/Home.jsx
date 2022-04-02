import { Container, CssBaseline } from '@mui/material'
import React, { useState, useContext, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import blogContext from '../Context/BlogContext';
import { Blog } from './Blog';
import { Spinner } from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';

export const Home = () => {

    const [allBlogs, setAllBlogs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [pageNo, setPageNo] = useState(1)
    const [totalPage, setTotalPage] = useState(null)
    const context = useContext(blogContext)
    let { theme, url } = context;
    const darkTheme = createTheme({
        palette: {
            mode: theme ? 'light' : 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });

    useEffect(() => {
        setIsLoading(true)
        fetchData()

    }, [])

    const fetchData = () => {
        // fetch(`${url}/api/v1/blogs&page=${pageNo}`).then(res => res.json()).then(data => {
        fetch(`${url}/api/v1/blogs`).then(res => res.json()).then(data => {
            setAllBlogs(allBlogs?.concat(data.allBlogs))
            // setTotalPage(data.length)
            setIsLoading(false);
        })
        setPageNo(pageNo + 1)
    }



    return (
        <div>
            <ThemeProvider theme={darkTheme}>

                <Container sx={{ mt: 2 }}>
                    <CssBaseline />
                    {
                        isLoading && <Spinner />
                    }
                    {
                        allBlogs &&

                        <InfiniteScroll
                            dataLength={totalPage} //This is important field to render the next data
                            next={fetchData}
                            hasMore={true}
                            loader={<Spinner />}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                            // below props only if you need pull down functionality
                            // refreshFunction={this.refresh}
                            // pullDownToRefresh
                            // pullDownToRefreshThreshold={50}
                            pullDownToRefreshContent={
                                <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                            }
                            releaseToRefreshContent={
                                <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                            }
                        >

                            {allBlogs.map(blog => (
                                <Blog blog={blog} key={blog._id} />
                            ))}
                        </InfiniteScroll>
                    }

                </Container>
            </ThemeProvider>
        </div>
    )
}
