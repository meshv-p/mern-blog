import { Avatar } from "@mui/material";
import React from "react";
import { stringToColor } from "../utils/commonFunctioins";

export const UserAvatar = ({ src: url, name = "User" }) => {
    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: name.charAt(0).toUpperCase() || "U",
        };
    }

    return (
        <Avatar
            loading="lazy"
            src={url}
            alt="Username"
            {...stringAvatar(name)}
            title={name}
        />
    );
};
