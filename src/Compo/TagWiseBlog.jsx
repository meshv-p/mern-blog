import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import blogContext from '../Context/BlogContext'
import { Blog } from './Blog'
import { Card, CardContent, CardHeader, Container, CssBaseline, Skeleton, Typography } from '@mui/material';
import { Head } from './Head';
import { stringToColor } from '../utils/commonFunctioins';

export const TagWiseBlog = () => {
    const [searchData, setSearchData] = useState()
    let { tag } = useParams()
    const context = useContext(blogContext);
    let { url } = context;


    useEffect(() => {
        // console.log(tag)

        fetch(`${url}/api/v1/search?tag=${tag}`).then(res => res.json()).then(data => {

            setSearchData(data.result);


        });
    }, [])


    return (
        <>
            <Container maxWidth='lg' sx={{ p: 1 }}>
                <Head title={`#${tag} - Dev Blog`} />
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
                    !searchData && (
                        <Card sx={{ m: 2 }}>
                            <CardHeader
                                avatar={

                                    <Skeleton animation="wave" variant="circular" width={40} height={40} />

                                }

                                title={

                                    <Skeleton
                                        animation="wave"
                                        height={10}
                                        width="80%"
                                        style={{ marginBottom: 6 }}
                                    />

                                }
                                subheader={

                                    <Skeleton animation="wave" height={10} width="40%" />

                                }
                            />

                            <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />


                            <CardContent>

                                <React.Fragment>
                                    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                                    <Skeleton animation="wave" height={10} width="80%" />
                                </React.Fragment>

                            </CardContent>
                        </Card>
                    )
                }
                {
                    searchData &&
                    searchData?.map(blog => (
                        <Blog blog={blog} key={blog._id} />
                    ))
                }
            </Container>
        </ >
    )
}
