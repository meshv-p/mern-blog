import React, { useEffect, useState, useContext } from 'react'
import {
    AvatarGroup,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader, CardMedia,
    IconButton,
    Stack,
    Typography
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Link, useNavigate } from 'react-router-dom';
import blogContext from '../Context/BlogContext';
import { AlertBar } from './Alert';
import { UserAvatar } from './UserAvatar';
import { timeAgo } from "../utils/timeAgo";
import { hexToHsl, stringToColor } from '../utils/commonFunctioins';


export const Blog = ({ blog, theme, BlogType = 'title', index }) => {

    const [userLiked, setUserLiked] = useState(false)
    const [totalLike, setTotalLike] = useState(0)
    const [open, setOpen] = useState(false)
    const context = useContext(blogContext)
    let { url, loggedinUser } = context;

    let history = useNavigate();


    useEffect(() => {

        // console.log(typeof localStorage.getItem('user'), typeof blog?.like[0]);
        let userId = JSON.parse(localStorage.getItem('user'))?.profile?._id;
        // console.log(blog.like?.includes(userId))
        setUserLiked(blog.like ? blog.like?.includes(userId) : false);
        setTotalLike(blog.totalLike ? blog.totalLike : 0)

    }, [blog.like, blog.totalLike])


    // const openBlog = (e) => {
    //     // console.log(e.currentTarget.dataset.key)
    //     let id = e.currentTarget.dataset.key;
    //     if (BlogType === 'user') {
    //         return history(`/user/${id}`);

    //     }
    //     history(`/blog/${id}`);
    // }
    const openProfile = (e) => {
        let id = e.currentTarget.dataset.key;
        history(`/user/${id}`);
    }


    const handleLike = () => {
        if (!loggedinUser) {
            setOpen(true)
            return
        }

        // "from":"123",
        // "to":"6245c68299b2268d8bccc47d",
        // "text":"maan has Followed you."
        fetch(`${url}/api/v1/notification/`, {
            method: 'POST',
            body: JSON.stringify({
                "from": `${JSON.parse(localStorage.getItem('user')).profile._id}`,
                "to": `${blog.user[0].user}`,
                "text": `has ${userLiked ? 'unliked' : 'liked'} your blog ${blog.title}.`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': (JSON.parse(localStorage.getItem('user'))?.authToken || JSON.parse(sessionStorage.getItem('user'))?.authToken)
            }
        }).then(res => res.json()).then(data => console.log(data));

        setTotalLike(userLiked ? totalLike - 1 : totalLike + 1)
        setUserLiked(!userLiked)
        fetch(`${url}/api/v1/blog/like/${blog._id}`, {
            method: 'PATCH',
            // body: JSON.stringify(loginDetails),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': (JSON.parse(localStorage.getItem('user'))?.authToken || JSON.parse(sessionStorage.getItem('user'))?.authToken)
            }
        }).then(res => res.json()).then(data => console.log(data))
    }

    function goToBlogComment() {
        history(`/blog/${blog._id}#Comments`)
    }

    const removeAlert = () => {
        setOpen(false)
        // console.log('close')
    }

    function shareBlog(blog) {
        if (navigator.share) {
            navigator
                .share({
                    title: `${blog.title} | ${document.location.href}`,
                    text: `Check out ${blog.title}`,
                    url: document.location.href + `blog/${blog._id}`,
                })
                .then(() => {
                    console.log('Successfully shared');
                })
                .catch(error => {
                    console.error('Something went wrong sharing the blog', error);
                });
        }
    }

    return (
        <>
            <Card elevation={3} sx={{ my: 2, cursor: 'pointer', border: `1px solid ${theme ? '#d9d9d9' : '#424242'}` }}
                key={blog._id} raised={true}>
                <AlertBar open={open} msg="Login to like.." type='error' remove={removeAlert} />
                {
                    index === 0 &&
                    <CardMedia
                        component="img"
                        alt="green iguana"
                        height="440"
                        image={`https://source.unsplash.com/random/?${blog?.tag[0]},${blog?.tag[1]},web`}
                        loading='lazy'
                        decoding='async'
                    />
                }
                <CardHeader
                    sx={{ ":hover": { background: !theme ? '#424242' : "#d9d9d9" } }}
                    onClick={e => openProfile(e)} data-key={blog.user?.[0]?._id || blog?._id}
                    avatar={
                        <UserAvatar src={blog.user?.[0]?.Profile_pic || blog?.Profile_pic}
                            name={(blog.user?.[0]?.username || blog.username) ?? 'User'} />
                    }
                    title={blog.user?.[0]?.username || blog?.username}
                    // subheader="Today,a min ago"
                    // subheader={new Date(blog.createdAt).toLocaleString()}
                    subheader={timeAgo(blog?.createdAt) + ' ago'}
                />
                <CardContent sx={{ cursor: 'pointer' }} data-key={blog._id}>
                    <Link to={BlogType === 'user' ? `/user/${blog._id}` : `/blog/${blog._id}`}>
                        <Typography variant='body1' sx={{
                            ":hover": {
                                color: 'blue'
                            }
                        }}>
                            {blog?.title}
                        </Typography>
                        {
                            BlogType === 'user' ?
                                <>
                                    <Typography variant='body1'>{blog?.name}  {blog?.email}</Typography>
                                </>
                                :
                                <Typography dangerouslySetInnerHTML={{ __html: `${(blog?.desc)?.slice(0, 50)} ...` }}
                                    variant='body2'
                                    color="text.secondary">
                                </Typography>
                        }
                        <Typography variant='body2' color="text.secondary">
                            {
                                BlogType === 'user' && (
                                    <Stack direction='column'>
                                        <Typography> Folllowers:{(blog.followers)?.length} ||
                                            Following:{(blog.following)?.length}</Typography>

                                        <AvatarGroup total={(blog.followers)?.length} sx={{ justifyContent: 'flex-end' }}>
                                            {
                                                blog.followers?.map((user, i) => (

                                                    <UserAvatar src={user.Profile_pic} key={i} name={user.username} />

                                                ))
                                            }
                                        </AvatarGroup>

                                    </Stack>
                                )
                            }
                        </Typography>
                        <Stack direction="row" gap={2} sx={{ my: 1 }}>
                            {
                                blog?.tag &&
                                blog?.tag?.map(tag => (
                                    <React.Fragment key={tag}>
                                        <Link to={`/t/${tag}`}>
                                            <Typography component="span" sx={{
                                                cursor: 'pointer',
                                                padding: .8,
                                                border: 1,
                                                borderColor: stringToColor(tag),
                                                borderRadius: 1,
                                                ":hover": { background: hexToHsl(stringToColor(tag)) }
                                            }}>
                                                <span># </span>
                                                <span style={{ color: stringToColor(tag) }}>{tag} </span>
                                            </Typography>
                                        </Link>
                                    </React.Fragment>
                                ))
                            }
                        </Stack>
                    </Link>

                </CardContent>
                {

                    (BlogType !== 'user') ?

                        <CardActions>
                            <IconButton onClick={handleLike}>
                                {
                                    userLiked ?
                                        <FavoriteIcon sx={{ color: '#42a5f5' }} />
                                        :
                                        <FavoriteIcon />

                                }
                            </IconButton>
                            {/* <Typography>{blog.totalLike ? blog.totalLike : 0}  likes</Typography> */}
                            <Typography>{totalLike ? totalLike : 0} likes</Typography>
                            <IconButton onClick={goToBlogComment}>
                                <ChatBubbleIcon />
                            </IconButton>
                            <Box sx={{ flexGrow: 1 }} />
                            <IconButton onClick={e => {
                                shareBlog(blog)
                            }}>
                                <SendIcon />
                            </IconButton>

                        </CardActions> : <Stack spacing={2} direction='row' sx={{ p: 1 }}>
                            {
                                blog._id !== loggedinUser?.profile?._id && (
                                    (blog?.followers)?.find(({ user }) => user === loggedinUser?.profile.user) ?
                                        <Button variant='contained'>
                                            UnFollow
                                        </Button> :
                                        <Button variant='text'>
                                            Follow
                                        </Button>
                                )
                            }
                            <Button onClick={() => history('/chat')} variant='outlined'>Message</Button>
                        </Stack>
                }

            </Card>
        </>
    )
}
