import React, { useState, useEffect } from "react";
import blogContext from "./BlogContext";
import { io } from "socket.io-client";

let socket = io("ws://localhost:5000");

export const BlogState = (props) => {
  const [theme, setTheme] = useState(false);
  const [loggedinUser, setLoggedinUser] = useState();
  const [progress, setProgress] = useState(0);
  const [socketState, setSocketState] = useState(socket);
  const [userNotification, setUserNotification] = useState(0);
  const [user_id, setUser_id] = useState(
    JSON.stringify(localStorage.getItem("user-id"))
  );
  let url = process.env.REACT_APP_URL;

  useEffect(() => {
    // console.log(socket);

    localStorage.setItem("user-id", socket.id);

    if (localStorage.getItem("Theme")) {
      let getTheme = JSON.parse(localStorage.getItem("Theme"));
      setTheme(getTheme);
    }

    if (localStorage.getItem("user")) {
      // console.log(JSON.parse(localStorage.getItem("user")));
      setLoggedinUser(JSON.parse(localStorage.getItem("user")));
      loggedinUser && console.log(loggedinUser);
    }
  }, []);

  // useEffect(() => {
  //   if (loggedinUser) {
  //     // console.log(loggedinUser);
  //     socket.auth = { user: loggedinUser.profile };
  //     socket.connect();
  //     socket.on("connect", () => {
  //       // console.log("connect", socket.id);
  //       // console.log(loggedinUser);
  //       // socket.emit("online", {
  //       //   user: loggedinUser?.profile,
  //       //   socket_user_id: socket.id,
  //       // });
  //     });
  //   }
  // }, [loggedinUser]);

  const toggleTheme = () => {
    setTheme(!theme);
    localStorage.setItem("Theme", !theme);
  };

  return (
    <blogContext.Provider
      value={{
        url,
        theme,
        toggleTheme,
        loggedinUser,
        setLoggedinUser,
        progress,
        setProgress,
        io,
        socketState,
        userNotification,
        setUserNotification,
        user_id,
      }}
    >
      {props.children}
    </blogContext.Provider>
  );
};
