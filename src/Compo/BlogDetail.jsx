import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, Divider, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link, useNavigate, useParams } from 'react-router-dom'
import blogContext from '../Context/BlogContext';
import { Spinner } from './Spinner';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfiniteScroll from 'react-infinite-scroll-component';
import { UserAvatar } from './UserAvatar';
import { useFetch } from '../hooks/useFetch';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Head } from './Head';
import { timeAgo } from "../utils/timeAgo";
import { hexToHsl, stringToColor } from '../utils/commonFunctioins';

export const BlogDetail = () => {
    const [comment, setComment] = useState([])
    // const [isLoading, setIsLoading] = useState(false)
    const [commentByUser, setCommentByUser] = useState("")
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(null)

    let { blogId } = useParams()
    const context = useContext(blogContext)
    let { url, loggedinUser, setProgress } = context;
    let { data: blog, } = useFetch(`${url}/api/v1/blog/${blogId}`)

    let history = useNavigate()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getComment = useCallback((pageNo) => {
        // console.log(page);
        fetch(`${url}/api/v1/comment/${blogId}/?page=${pageNo || page}`).then(res => res.json()).then(data => {
            setComment(comment.concat(data.commentByBlog));
            setTotalPage(data.length)
            // console.log(data);
            setPage(page + 1)
        })
        // console.log(page);
    })

    useEffect(() => {

        // console.log(loggedinUser?.authToken, url);
        setProgress(10)
        // setIsLoading(true)
        // fetch(`${url}/api/v1/blog/${blogId}`).then(res => res.json()).then(data => {
        //     setIsLoading(false);
        //     setBlog(data.findBlog[0])
        // })
        getComment()

    }, [])

    useEffect(() => {

        blog && setProgress(100)

    }, [blog])



    function handleDelete() {
        // console.log(blog._id)
        fetch(`${url}/api/v1/blog/${blog._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${loggedinUser.authToken}`
            }
        }).then(res => res.json()).then(data => {
            // console.log(data)
            history('/')
        })
    }

    function handleEdit() {
        // console.log(blog._id)
        history(`/blog/edit/${blog._id}`, {
            state: {
                blog
            }
        })
    }



    const handleSubmit = (e) => {
        // setPage(1)
        if (commentByUser === '') return
        e.preventDefault()
        // console.log(commentByUser)
        fetch(`${url}/api/v1/comment/${blogId}`, {
            method: 'POST',
            body: JSON.stringify({ title: commentByUser }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loggedinUser.authToken}`
            }
        }).then(res => res.json()).then((data) => {
            setCommentByUser("");
            data.newComment = { ...data.newComment, user: [{ Profile_pic: loggedinUser?.profile?.Profile_pic, username: loggedinUser?.profile?.username }] }
            // console.log(comment.unshift(data.newComment))
            setComment(comment.concat(data.newComment).reverse())

        })


        fetch(`${url}/api/v1/notification/`, {
            method: 'POST',
            body: JSON.stringify({
                from: `${JSON.parse(localStorage.getItem('user')).profile._id}`,
                to: `${blog.user.user}`,
                text: `has commented on your post - ${commentByUser}.`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': (JSON.parse(localStorage.getItem('user'))?.authToken || JSON.parse(sessionStorage.getItem('user'))?.authToken)
            }
        }).then(res => res.json()).then(data => { });
        // console.log(comment)
    }


    return (
        <div  >

            <Head title={`${blog?.title} by ${blog?.user.username} - Dev Blog`} />
            <Container sx={{ py: 2 }}>
                {/* {
                        isLoading && <Spinner />
                    } */}

                <React.Suspense fallback={<Spinner />}>
                    {
                        blog &&
                        // <Card sx={{ background: '#bbdefb' || '#e3f2fd' }}>

                        <Card >
                            <Typography sx={{ m: 1 }}>
                                <Button variant="outlined" onClick={() => {
                                    if (history(-1)) {

                                        history(-1)
                                    }
                                    history('/')
                                }


                                }

                                    color="inherit" startIcon={<ArrowBackIosNewIcon />}>
                                    Go back
                                </Button>
                            </Typography>
                            <CardHeader
                                avatar={
                                    <UserAvatar src={blog.user?.Profile_pic} name={blog.user?.username ?? 'User'} />

                                }
                                title={
                                    <Link to={`/user/${blog.user?._id}`}>
                                        {blog?.user?.username}
                                    </Link>
                                }
                                // subheader={new Date(blog.createdAt).toLocaleString()}
                                subheader={`${timeAgo(blog.createdAt)} ago`}
                                action={
                                    blog?.user?._id === loggedinUser?.profile._id &&
                                    <>
                                        <IconButton aria-label="settings" onClick={handleEdit}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                        <IconButton aria-label="settings" onClick={handleDelete}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </>
                                }
                            />
                            <CardMedia
                                component="img"
                                alt="green iguana"
                                height="440"
                                image={`https://source.unsplash.com/random/?${blog?.tag[0]},${blog?.tag[1]},web`}
                                loading='lazy'
                                decoding='async'
                            />
                            <CardContent >
                                <Typography variant='h4'>
                                    {blog.title}
                                    {/* <Typography>#tag</Typography> */}
                                    <Stack direction="row" gap={2} sx={{ my: 1 }}>
                                        {
                                            blog.tag.map(tag => (
                                                // <React.Fragment key={tag}>
                                                <Link to={`/t/${tag}`} key={tag}>
                                                    <Typography component="span" sx={{ cursor: 'pointer', padding: .8, border: 1, borderColor: stringToColor(tag), borderRadius: 1, ":hover": { background: hexToHsl(stringToColor(tag)) } }}>
                                                        <span  ># </span>
                                                        <span style={{ color: stringToColor(tag) }}>{tag} </span>
                                                    </Typography>
                                                </Link>
                                                // </React.Fragment>
                                            ))
                                        }
                                    </Stack>
                                    {/* {blog.title} */}
                                </Typography>
                                <span>
                                    <Typography dangerouslySetInnerHTML={{ __html: blog.desc }} variant='body2' sx={{ my: 2 }} color="text.secondary">
                                    </Typography>
                                </span>

                                <Divider sx={{ mt: 2 }} />

                                <Box sx={{ my: 2 }}>
                                    <Typography variant='body1' id="Comments">Comments:</Typography>
                                </Box>
                                {
                                    loggedinUser ?
                                        <form onSubmit={handleSubmit}>

                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Add a comment"
                                                multiline
                                                rows={3}
                                                fullWidth
                                                required={true}
                                                value={commentByUser}
                                                onChange={e => setCommentByUser(e.target.value)}
                                            />
                                            <Stack spacing={2} sx={{ mt: 2 }} direction="row">
                                                <Button variant="contained" type="submit" onClick={handleSubmit}>Submit</Button>
                                                <Button variant="text">Cancel</Button>
                                            </Stack>
                                        </form>
                                        :
                                        <Typography>Login to comment</Typography>
                                }



                                {/* comment part */}
                                {
                                    comment.length !== 0 ?

                                        <InfiniteScroll
                                            dataLength={comment?.length} //This is important field to render the next data
                                            next={getComment}
                                            hasMore={(comment?.length) !== totalPage}
                                            // {console.log(comment,totalPage)}
                                            loader={<Spinner />}
                                            pullDownToRefreshContent={
                                                <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                                            }
                                            releaseToRefreshContent={
                                                <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                                            }
                                        >

                                            {comment?.map(c => (
                                                <Paper variant="outlined" sx={{ m: 2 }} key={c._id}>
                                                    <Card>
                                                        <CardHeader
                                                            avatar={
                                                                <UserAvatar src={c.user[0]?.Profile_pic} name={c.user[0]?.username ?? 'User'} />
                                                            }
                                                            title={<Link to={`/user/${c.user[0]?._id}`}>
                                                                {c?.user[0]?.username}
                                                            </Link>}
                                                            // subheader={c.createdAt ? new Date(c?.createdAt)?.toLocaleString() : new Date().toLocaleString()}
                                                            subheader={c.createdAt ? `${timeAgo(c?.createdAt)} ago` : `${timeAgo(new Date().toLocaleString())} ago`}
                                                            action={
                                                                <IconButton aria-label="settings">
                                                                    <MoreVertIcon />
                                                                </IconButton>
                                                            }
                                                        />
                                                        <CardContent>
                                                            <Typography>{c.title}</Typography>
                                                        </CardContent>
                                                        <CardActions>
                                                            <Button variant="outlined" color='success' startIcon={<FavoriteIcon />}>
                                                                9 Like
                                                            </Button>

                                                        </CardActions>
                                                    </Card>
                                                </Paper>
                                            ))}

                                        </InfiniteScroll>
                                        :
                                        <Typography sx={{ m: 2 }} color="GrayText">No comments yet.Be first commenter on this post...</Typography>

                                }


                            </CardContent>



                        </Card>
                    }
                </React.Suspense>

            </Container>

        </div >
    )
}
