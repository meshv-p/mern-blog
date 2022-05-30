import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { UserAvatar } from './UserAvatar';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box >
                    <Typography component='div'>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs({ followers, following }) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Followers" {...a11yProps(0)} />
                    <Tab label="Following" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <List>
                    {
                        followers.length !== 0 ? followers?.map(user => (
                            <ListItem key={user._id} secondaryAction={
                                <IconButton edge="end" aria-label="delete">

                                </IconButton>
                            }>
                                <ListItemAvatar>

                                    <UserAvatar src={user?.Profile_pic} name={user.username} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.username}
                                    secondary={user?.name ?? ''}
                                />
                            </ListItem>
                        ))
                            : "Not followers other"
                    }
                </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <List>
                    {
                        following.length !== 0 ? following?.map(user => (
                            <ListItem key={user._id} secondaryAction={
                                <Button variant='text' size='small'>Unfollow</Button>
                            }>
                                <ListItemAvatar>

                                    <UserAvatar src={user?.Profile_pic} name={user.username} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.username}
                                    secondary={user?.name ?? ''}
                                />
                            </ListItem>
                        ))
                            : "Not following other"

                    }

                </List>
            </TabPanel>

        </Box>
    );
}
