import { CircularProgress } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

export const Spinner = () => {
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress />
            </Box>
        </>
    )
}
