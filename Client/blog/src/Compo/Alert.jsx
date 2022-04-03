import { Alert, Snackbar } from '@mui/material'
import React from 'react'

export const AlertBar = ({ open, msg, type, remove }) => {


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        if (remove) {
            remove()
        }

    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={1000} onClose={remove}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                    {/* {loginError?.msg} */}
                    {msg}
                </Alert>
            </Snackbar>
        </div>
    )
}
