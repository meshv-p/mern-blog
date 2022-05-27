import React, { useContext } from 'react'
import blogContext from '../Context/BlogContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Card, CardContent, Container, CssBaseline, Typography } from '@mui/material';

export const NetworkStatus = () => {
    const context = useContext(blogContext)
    let { theme, userIsOnline } = context;
    const darkTheme = createTheme({
        palette: {
            mode: theme ? 'light' : 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });


    return (
        <div>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />

                <Container>
                    <Card>
                        <CardContent>
                            <Typography>You are offline...</Typography>
                        </CardContent>
                    </Card>
                </Container>

            </ThemeProvider>

        </div>
    )
}
