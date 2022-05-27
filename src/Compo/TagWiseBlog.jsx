import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import blogContext from '../Context/BlogContext'
import { Blog } from './Blog'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Card, CardContent, Container, CssBaseline, Typography } from '@mui/material';

export const TagWiseBlog = () => {
    const [searchData, setSearchData] = useState()
    let { tag } = useParams()
    const context = useContext(blogContext);
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
        console.log(tag)

        fetch(`${url}/api/v1/search?tag=${tag}`).then(res => res.json()).then(data => {

            setSearchData(data.result);


        });
    }, [])
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

    return (
        <ThemeProvider theme={darkTheme}>
            <Container maxWidth='lg' sx={{ p: 1 }}>
                <Card sx={{ minWidth: 275 }}>

                    <CardContent sx={{ borderTop: `1rem solid ${stringToColor(tag)}` }}>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Tag
                        </Typography>
                        <Typography variant="h5" component="div">
                            # {tag}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Official tag for Facebook's React JavaScript library for building user interfaces

                        </Typography>
                    </CardContent>
                </Card>
            </Container>


            <Container sx={{ pt: 2 }}>
                <CssBaseline />
                {
                    searchData &&
                    searchData?.map(blog => (
                        <Blog blog={blog} key={blog._id} />
                    ))
                }
            </Container>
        </ThemeProvider>
    )
}
