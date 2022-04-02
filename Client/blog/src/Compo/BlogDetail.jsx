import { Avatar, backdropClasses, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Container, CssBaseline, Divider, Icon, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link, useNavigate, useParams } from 'react-router-dom'
import blogContext from '../Context/BlogContext';
import { Spinner } from './Spinner';
import FavoriteIcon from '@mui/icons-material/Favorite';


export const BlogDetail = () => {
    const [blog, setBlog] = useState(null)
    const [comment, setComment] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [commentByUser, setCommentByUser] = useState("")
    let { blogId } = useParams()
    const context = useContext(blogContext)
    let { theme, url, loggedinUser } = context;

    let history = useNavigate()


    const darkTheme = createTheme({
        palette: {
            mode: theme ? 'light' : 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });

    useEffect(() => {
        // console.log(loggedinUser?.authToken, url);
        setIsLoading(true)
        fetch(`${url}/api/v1/blog/${blogId}`).then(res => res.json()).then(data => {
            setIsLoading(false);
            setBlog(data.findBlog[0])
        })

        getComment()

    }, [])


    const getComment = () => {

        fetch(`${url}/api/v1/comment/${blogId}`).then(res => res.json()).then(data => {
            // data.re
            setComment(data);
            // console.log(data);
        })
    }




    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(commentByUser)
        fetch(`${url}/api/v1/comment/${blogId}`, {
            method: 'POST',
            body: JSON.stringify({ title: commentByUser }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loggedinUser.authToken}`
            }
        }).then(res => res.json()).then(data => {
            setCommentByUser("");
            getComment()
        })
        // console.log(comment)
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
        return `hsl(${stringUniqueHash}, 34%, 25%)`;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: name.charAt(0),
        };
    }

    return (
        <div>
            <ThemeProvider theme={darkTheme}>

                <CssBaseline />
                <Container sx={{ my: 2 }}>
                    {
                        isLoading && <Spinner />
                    }
                    {
                        !isLoading && blog &&
                        <Card>
                            <Typography sx={{ m: 1 }}>
                                <Button variant="outlined" onClick={() => history('/')} color="inherit" startIcon={<ArrowBackIosNewIcon />}>
                                    Go back
                                </Button>
                            </Typography>
                            <CardHeader
                                avatar={
                                    <Avatar src={blog.user[0]?.Profile_pic} alt="Username" {...stringAvatar(blog.user[0]?.username ? blog.user[0].username : 'Admin')} />

                                }
                                title={
                                    <Link to={`/user/${blog.user[0]?.user}`}>
                                        {blog.user[0]?.username}
                                    </Link>
                                }
                                subheader={new Date(blog.createdAt).toLocaleString()}
                                action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                            />
                            <CardMedia
                                component="img"
                                alt="green iguana"
                                height="440"
                                image={'https://source.unsplash.com/random/300x200'}
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
                                                <React.Fragment key={tag}>
                                                    <Typography component="span" sx={{ cursor: 'pointer', padding: .8, border: 1, borderColor: stringToColor(tag), borderRadius: 1, ":hover": { background: stringToRgba(tag) } }}>
                                                        <span  ># </span>
                                                        <span style={{ color: stringToColor(tag) }}>{tag} </span>
                                                    </Typography>
                                                </React.Fragment>
                                            ))
                                        }
                                    </Stack>
                                    {/* {blog.title} */}
                                </Typography>
                                <Typography variant='body2' sx={{ my: 2 }} color="text.secondary">
                                    {blog.desc}
                                    {/* {blog.desc} */}
                                </Typography>

                                <Divider sx={{ mt: 2 }} />

                                <Box sx={{ my: 2 }}>
                                    <Typography variant='body1'>Comments:</Typography>
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
                                    comment?.length != 0 ?
                                        comment?.map(c => (
                                            <Paper variant="outlined" sx={{ m: 2 }} key={c._id}>
                                                <Card sx={{ m: 2 }}>
                                                    <CardHeader
                                                        avatar={
                                                            <Avatar src={c.user[0]?.Profile_pic} alt="Username" {...stringAvatar(c.user[0]?.username ? c.user[0].username : 'User')} />

                                                        }
                                                        title={c.user[0].username}
                                                        subheader={new Date(c.createdAt).toLocaleString()}
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
                                        ))
                                        :
                                        <Typography sx={{ m: 2 }} color="GrayText">No comments yet.Be first commenter on this post...</Typography>

                                }


                            </CardContent>



                        </Card>
                    }

                </Container>
            </ThemeProvider>

        </div>
    )
}
