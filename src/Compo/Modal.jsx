import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Stack, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

export const Modal = ({ title, modelOpen, setModelOpen, children }) => {

    return (
        <div>
            <Dialog open={modelOpen} onClose={() => setModelOpen(false)} maxWidth='md'>
                <DialogTitle>
                    <Stack direction='row' justifyContent='space-between' alignItems='center'>

                        {/* <Typography > */}
                        {title}
                        {/* </Typography> */}

                        <IconButton onClick={() => setModelOpen(false)}>
                            <CloseIcon />
                        </IconButton>

                    </Stack>
                </DialogTitle>
                <DialogContent>
                    {children}
                    {/* <Box sx={{ p: 1 }}>
                        <Stack spacing={2}>
                            <Stack direction='row' spacing={2}>
                                <UserAvatar src={profile?.oneUser?.Profile_pic} name={profile?.oneUser?.username} />

                            </Stack>

                            <Button variant="outlined" type='submit' color='success' >
                                Save
                            </Button>
                        </Stack>
                    </Box> */}


                    {/* <img src={profile?.oneUser?.Profile_pic} alt={profile?.oneUser?.Username} width='auto' style={{ borderRadius: 8, width: '1200px', height: 'auto' }} /> */}
                </DialogContent>
            </Dialog>
        </div>
    )
}
