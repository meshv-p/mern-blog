import React, { useEffect, useState, useContext } from 'react'
import { Avatar, AvatarGroup, Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, Stack, Typography } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Link, useNavigate } from 'react-router-dom';
import blogContext from '../Context/BlogContext';
import { AlertBar } from './Alert';
import { UserAvatar } from './UserAvatar';



export const Blog = ({ blog, theme, BlogType = 'title' }) => {

    const [userLiked, setUserLiked] = useState(false)
    const [totalLike, setTotalLike] = useState(0)
    const [open, setOpen] = useState(false)
    const context = useContext(blogContext)
    let { url, loggedinUser, setUserNotification, userNotification } = context;

    let history = useNavigate();


    useEffect(() => {

        // console.log(typeof localStorage.getItem('user'), typeof blog?.like[0]);
        let userId = JSON.parse(localStorage.getItem('user'))?.profile?.user;
        // console.log(blog.like?.includes(userId))
        setUserLiked(blog.like ? blog.like?.includes(userId) : false);
        setTotalLike(blog.totalLike ? blog.totalLike : 0)

        // socket.on('like', ({ sms, user, blogOwner }) => {
        //     console.log(blogOwner._id, loggedinUser.profile._id)
        //     if (blogOwner._id === loggedinUser.profile._id) {
        //         setUserNotification(userNotification + 1)
        //     }
        //     // console.log(sms, user)
        // })
        // return () => {
        //     // console.log('lear');
        //     socket.off('like')
        //     // console.clear()
        // }
        // console.log(totalLike);
    }, [])





    const openBlog = (e) => {
        // console.log(e.currentTarget.dataset.key)
        let id = e.currentTarget.dataset.key;
        if (BlogType === 'user') {
            return history(`/user/${id}`);

        }
        history(`/blog/${id}`);
    }
    const openProfile = (e) => {
        console.log(e.currentTarget.dataset.key)
        let id = e.currentTarget.dataset.key;
        history(`/user/${id}`);
    }


    const handleLike = () => {
        if (!loggedinUser) {
            setOpen(true)
            return
        }

        setTotalLike(userLiked ? totalLike - 1 : totalLike + 1)
        setUserLiked(!userLiked)
        fetch(`${url}/api/v1/blog/like/${blog._id}`, {
            method: 'PATCH',
            // body: JSON.stringify(loginDetails),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).authToken
            }
        }).then(res => res.json()).then(data => console.log(data))
    }

    const removeAlert = () => {
        setOpen(false)
        // console.log('close')
    }
    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        // console.log(color);
        /* eslint-enable no-bitwise */
        return color;
    }
    function stringToRgba(string) {
        let stringUniqueHash = [...string].reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        return `hsl(${stringUniqueHash}, 44%, 18%)`;
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
            <Card elevation={3} sx={{ my: 2, cursor: 'pointer', border: `1px solid ${theme ? '#d9d9d9' : '#424242'}` }} key={blog._id} raised={true}>
                <AlertBar open={open} msg="Login to like.." type='error' remove={removeAlert} />

                <CardHeader
                    sx={{ ":hover": { background: !theme ? '#424242' : "#d9d9d9" } }}
                    onClick={e => openProfile(e)} data-key={blog?.user[0]?._id || blog?._id}
                    avatar={
                        <UserAvatar src={blog.user[0]?.Profile_pic || blog?.Profile_pic} name={(blog.user[0]?.username || blog?.username) ?? 'User'} />
                    }
                    title={blog.user[0]?.username || blog?.username}
                    // subheader="Today,a min ago"
                    subheader={new Date(blog.createdAt).toLocaleString()}
                />
                <CardContent sx={{ cursor: 'pointer' }} data-key={blog._id}>
                    <Link to={`/blog/${blog._id}`}>
                        <Typography variant='body1' sx={{
                            ":hover": {
                                color: 'blue'
                            }
                        }}>
                            {blog.title}
                        </Typography>
                        <Typography variant='body2' color="text.secondary">
                            {blog.desc}
                            {
                                BlogType === 'user' && (
                                    <Stack direction='column'>
                                        <Typography> Folllowers:{(blog.followers)?.length} || Following:{(blog.following)?.length}</Typography>

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
                                blog?.tag?.map(tag => (
                                    <React.Fragment key={tag}>
                                        <Link to={`/t/${tag}`}>
                                            <Typography component="span" sx={{ cursor: 'pointer', padding: .8, border: 1, borderColor: stringToColor(tag), borderRadius: 1, ":hover": { background: stringToRgba(tag) } }}>
                                                <span  ># </span>
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
                            <IconButton>
                                <ChatBubbleIcon />
                            </IconButton>
                            <Box sx={{ flexGrow: 1 }} />
                            <IconButton onClick={e => {
                                shareBlog(blog)
                            }}>
                                <SendIcon />
                            </IconButton>

                        </CardActions> : <Stack spacing={2} direction='row' sx={{ p: 1 }}>
                            <Button variant='text'>
                                Follow
                            </Button>
                            <Button variant='outlined'>Message</Button>
                        </Stack>
                }

            </Card>
        </>
    )
}
