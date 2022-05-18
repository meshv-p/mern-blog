import { Avatar } from '@mui/material';
import React from 'react'

export const UserAvatar = ({ src: url, name = '' }) => {

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



    function stringAvatar(name) {


        return {
            sx: {
                bgcolor: stringToColor(name),


            },
            children: name.charAt(0) || 'U',
        };
    }

    return (
        <Avatar src={url} alt="Username" {...stringAvatar(name)} />

    )
}
