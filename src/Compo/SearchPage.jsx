import { Container, CssBaseline, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import blogContext from '../Context/BlogContext';
import { Blog } from './Blog';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export const SearchPage = () => {
    const context = useContext(blogContext);
    let { theme, searchData, alignment, setAlignment, search } = context;

    const darkTheme = createTheme({
        palette: {
            mode: theme ? 'light' : 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });

    const handleChange = (event, newAlignment) => {
        if (!newAlignment) return
        setAlignment(newAlignment);
    };


    // useEffect(() => {
    //     // console.log(alignment, 'changed', searchData)
    // }, [alignment])


    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <Container sx={{ m: 2 }}>
                    <CssBaseline />
                    <Stack direction='row' sx={{ flexDirection: { xs: 'column', md: 'row' } }}>

                        <ToggleButtonGroup
                            color="primary"
                            value={alignment}
                            orientation='vertical'
                            exclusive
                            onChange={handleChange}
                            sx={{ p: 2 }}
                        >
                            <ToggleButton value="title">Blog</ToggleButton>
                            <ToggleButton value="tag">Tag</ToggleButton>
                            <ToggleButton value="user">User</ToggleButton>
                        </ToggleButtonGroup>
                        {/* <div className="results"> */}
                        <Paper sx={{ flexGrow: 1, p: 1 }}>
                            <Typography variant='subtitle1'>Your Search Results: <b>  {search}</b></Typography>
                            {
                                searchData?.message === 'Not found' ?
                                    <h1 style={{ padding: 1 }}>
                                        Result Not found
                                    </h1> :


                                    alignment && searchData && searchData?.map(data => (
                                        <Blog blog={data} key={data._id} BlogType={alignment} />
                                    ))
                            }
                        </Paper>
                        {/* </div> */}
                    </Stack>

                </Container>
            </ThemeProvider>
        </>
    )
}