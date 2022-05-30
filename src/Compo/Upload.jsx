import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import Stack from '@mui/material/Stack';
import styled from '@emotion/styled';

import { UserAvatar } from './UserAvatar';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import blogContext from '../Context/BlogContext';



export const Upload = ({ user, profile }) => {
    const [editProfile, setEditProfile] = useState({
        username: profile.username,
        name: profile.name,
        email: profile.email,
        number: profile.number,
        Profile_pic: profile.Profile_pic
    })
    const [updateProfile_pic, setUpdatedProfile_pic] = useState(null);
    const [modelOpen, setModelOpen] = useState(false)
    const context = useContext(blogContext);
    let { url, setLoggedinUser, loggedinUser } = context;

    useEffect(() => {

        updateProfile_pic !== null && updateProfile()
    }, [updateProfile_pic])



    function updateProfile() {


        fetch(`${url}/api/v1/users/${user}`, {
            method: "PATCH",
            body: JSON.stringify(editProfile),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then(data => {
            let user = loggedinUser || JSON.parse(localStorage.getItem("user"));
            user.profile = data.newProfile;
            setLoggedinUser(user)
            localStorage.setItem('user', JSON.stringify(user))
            console.log(data, user)
            document.location.reload()

        })
    }

    function handleS(e) {
        e.preventDefault();

        let fd = new FormData()
        fd.append('upload_preset', 'yio8fvkd');
        fd.append('file', editProfile.Profile_pic);
        console.log(fd.get('file'))
        fetch(`https://api.cloudinary.com/v1_1/dqveulwdc/upload`, {
            method: "POST",
            body: fd,
        })
            .then((res) => res.json())
            .then(async (data) => {
                setEditProfile({ ...editProfile, Profile_pic: data.secure_url })
                await setUpdatedProfile_pic(data.secure_url)

            });

    }
    const Input = styled('input')({
        display: 'none',
    });
    return (
        <div>
            <form onSubmit={handleS}>
                <Dialog open={modelOpen} onClose={() => setModelOpen(false)} maxWidth='md'>
                    <DialogTitle>
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>

                            {/* <Typography > */}
                            Edit Profile
                            {/* </Typography> */}

                            <IconButton onClick={() => setModelOpen(false)}>
                                <CloseIcon />
                            </IconButton>

                        </Stack>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ p: 1 }}>
                            <Stack spacing={2}>
                                <Stack direction='row' spacing={2}>
                                    <UserAvatar src={profile?.Profile_pic} name={profile?.username} />
                                    <label htmlFor="outlined-button-file">
                                        <Input id="outlined-button-file" name="Profile_pic" multiple type="file" onChange={e => setEditProfile({ ...editProfile, [e.target.name]: e.target.files[0] })} />

                                        {
                                            <>
                                                <Button variant="outlined" type='button' component="span" startIcon={<CloudUploadIcon />} >
                                                    Upload
                                                </Button>
                                                <Button variant="outlined" type='submit' startIcon={<CloudUploadIcon />} >
                                                    Change Pic
                                                </Button>
                                            </>
                                        }


                                    </label>
                                </Stack>
                                <TextField id="outlined-basic" value={editProfile.username} name="username" onChange={e => setEditProfile({ ...editProfile, [e.target.name]: e.target.value })} label="Username" variant="outlined" />
                                <TextField id="outlined-basic" value={editProfile.name} name="name" onChange={e => setEditProfile({ ...editProfile, [e.target.name]: e.target.value })} label="Name" variant="outlined" />
                                <TextField id="outlined-basic" value={editProfile.email} name="email" onChange={e => setEditProfile({ ...editProfile, [e.target.name]: e.target.value })} label="Email" variant="outlined" />
                                <TextField id="outlined-basic" value={editProfile.number} name="number" onChange={e => setEditProfile({ ...editProfile, [e.target.name]: e.target.value })} label="Number" variant="outlined" />
                                {/* <TextField id="outlined-basic" label="Number" variant="outlined" /> */}

                                <Button variant="outlined" type='submit' color='success' startIcon={<DoneIcon />} onClick={handleS} >
                                    Save
                                </Button>
                            </Stack>
                        </Box>


                        {/* <img src={profile?.oneUser?.Profile_pic} alt={profile?.oneUser?.Username} width='auto' style={{ borderRadius: 8, width: '1200px', height: 'auto' }} /> */}
                    </DialogContent>
                </Dialog>

                {/* <input type="file" name="file" id="file" onChange={e => setFile(e.targetP.rofile_pics[0])} />
                <button type="submit">Upload</button> */}

            </form>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setModelOpen(true)}>
                Edit Profile
            </Button>
        </div>
    )
}
