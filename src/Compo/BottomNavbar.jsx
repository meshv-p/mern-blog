import React from 'react'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Paper } from '@mui/material';

export const BottomNavbar = () => {
    const [value, setValue] = React.useState('recents');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>

                <BottomNavigation sx={{ width: 500, display: { xs: 'block', md: 'none' } }} value={value} onChange={handleChange}>
                    <BottomNavigationAction
                        label="Recents"
                        value="recents"
                        icon={<RestoreIcon />}
                    />
                    <BottomNavigationAction
                        label="Favorites"
                        value="favorites"
                        icon={<FavoriteIcon />}
                    />
                    <BottomNavigationAction
                        label="Nearby"
                        value="nearby"
                        icon={<LocationOnIcon />}
                    />
                    <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
                </BottomNavigation>
            </Paper>
        </>
    )
}
