import React, { useEffect, useState, useContext } from 'react'
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, IconButton, Typography } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useNavigate } from 'react-router-dom';
import blogContext from '../Context/BlogContext';
import { AlertBar } from './Alert';



export const Blog = ({ blog, theme }) => {

    const [userLiked, setUserLiked] = useState(false)
    const [totalLike, setTotalLike] = useState(0)
    const [open, setOpen] = useState(false)
    const context = useContext(blogContext)
    let { url, loggedinUser } = context;

    let history = useNavigate();
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
    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: name.charAt(0),
        };
    }

    useEffect(() => {
        // console.log(typeof localStorage.getItem('user'), typeof blog?.like[0]);
        let userId = JSON.parse(localStorage.getItem('user'))?.profile?.user;
        // console.log(blog.like?.includes(userId))
        setUserLiked(blog.like ? blog.like?.includes(userId) : false);
        setTotalLike(blog.totalLike ? blog.totalLike : 0)
        // console.log(totalLike);
    }, [])



    const openBlog = (e) => {
        // console.log(e.currentTarget.dataset.key)
        let id = e.currentTarget.dataset.key;
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


    return (
        <>
            <Card elevation={3} sx={{ my: 2, cursor: 'pointer', border: `1px solid ${theme ? '#d9d9d9' : '#424242'}` }} key={blog._id} raised={true}>
                <AlertBar open={open} msg="Login to like.." type='error' remove={removeAlert} />

                <CardHeader
                    sx={{ ":hover": { background: !theme ? '#424242' : "#d9d9d9" } }}
                    onClick={e => openProfile(e)} data-key={blog?.user[0]?.user}
                    avatar={
                        <Avatar src={blog.user[0]?.Profile_pic} alt="Username" {...stringAvatar(blog.user[0]?.username ? blog.user[0].username : 'Admin')} />
                    }
                    title={blog.user[0]?.username}
                    // subheader="Today,a min ago"
                    subheader={new Date(blog.createdAt).toLocaleString()}
                />
                <CardContent sx={{ cursor: 'pointer' }} onClick={(e) => openBlog(e)} data-key={blog._id}>
                    <Typography variant='body1'>
                        {blog.title}
                    </Typography>
                    <Typography variant='body2' color="text.secondary">
                        {blog.desc}
                    </Typography>
                </CardContent>
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
                    <IconButton>
                        <SendIcon />
                    </IconButton>

                </CardActions>
            </Card>
        </>
    )
}
