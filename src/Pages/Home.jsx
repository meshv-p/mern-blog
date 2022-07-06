import { Container, CssBaseline } from '@mui/material'
import React, { useState, useContext, useEffect } from 'react'
import blogContext from '../Context/BlogContext';
import { Blog } from '../Compo/Blog';
import { Spinner } from '../Compo/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AlertBar } from '../Compo/Alert';
import { NetworkStatus } from '../Compo/NetworkStatus';
import { Head } from '../Compo/Head';
import { addBlog, getDataFromIndexDb, startDb } from '../utils/indexDb';
export const Home = ({ res }) => {
    const [allBlogs, setAllBlogs] = useState([]);

    const [isLoading, setIsLoading] = useState(false)
    const [pageNo, setPageNo] = useState(1)
    const [totalPage, setTotalPage] = useState(null)
    const [open, setOpen] = useState(false)
    const context = useContext(blogContext)
    let { theme, url, setProgress, userIsOnline } = context;


    useEffect(() => {
        startHome()
        // return () => {
        //     console.clear()
        // }
        console.log(res);
    }, [])

    async function startHome() {
        await startDb().then(() => {
            // console.log('db started')
        }).catch((err) => {
            console.log(err)
        })

        setOpen(true)
        setIsLoading(true)
        fetchData()

    }




    const fetchData = async () => {
        setProgress(10)
        //check if data with page no is exist in indexdb
        // let data =
        //     // console.log('db', db)
        //     await getDataFromIndexDb(pageNo).then((d) => {
        //         // console.log(d.blog)
        //         return d;
        //     }).catch((err) => {
        //         console.log(err)
        //         // fetchDataFromServer()
        //     })

        // if (data) {
        //     setAllBlogs(allBlogs => [...allBlogs, ...data.blog])
        //     setIsLoading(false)
        //     setProgress(100)
        //     setOpen(false)
        //     setTotalPage(data.length)
        //     setPageNo(pageNo + 1)
        //     return
        // }
        //if not exist in indexdb then fetch data from api
        fetch(`${url}/api/v1/blogs/?page=${pageNo}`).then(res => res.json()).then(data => {
            // fetch(`${url}/api/v1/blogs`).then(res => res.json()).then(data => {
            setAllBlogs(allBlogs?.concat(data.allBlogs))
            setTotalPage(data.length)
            setIsLoading(false);
            setOpen(false)
            addBlog(pageNo, data.allBlogs)
        })
        setProgress(100)
        setPageNo(pageNo + 1)
    }




    return (
        <div >

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
        </div>
    )
}

//  default Home

export function getServerProps() {
    fetch(`http://localhost:5000/api/v1/blogs/?page=${1}`).then(res => res.json()).then(data => {
        // fetch(`${url}/api/v1/blogs`).then(res => res.json()).then(data => {
        // setAllBlogs(allBlogs?.concat(data.allBlogs))
        // setTotalPage(data.length)
        // setIsLoading(false);
        // setOpen(false)
        // addBlog(pageNo, data.allBlogs)
        let res = data.allBogs
        return {
            props: res
        }
    })
}