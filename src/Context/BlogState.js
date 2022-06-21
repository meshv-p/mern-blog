import React, { useState, useEffect } from "react";
import blogContext from "./BlogContext";

//implement the socket.io
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5001", {
//   // reconnectionDelayMax: 10000,
//   // auth: {
//   //   token: "123",
//   // },
//   query: {
//     id: JSON.parse(localStorage.getItem("user")).profile._id,
//     name: JSON.parse(localStorage.getItem("user")).profile.username,
//   },
// });

// socket.on("connect", () => {
//   console.log("Connected to server", socket.id);
// });

// socket.on("hey", (data) => {
//   console.log(data);
// });
// socket.emit("hey", {
//   user: "meshv",
//   id: 12,
//   msg: "Hello",
//   to: "6245c9a799b2268d8bccc49e",
// });

export const BlogState = (props) => {
  const [theme, setTheme] = useState(false);
  const [loggedinUser, setLoggedinUser] = useState();
  const [progress, setProgress] = useState(0);
  const [searchData, setSearchData] = useState([]);
  const [search, setSearch] = React.useState("");
  const [blog, setBlog] = useState(null);
  const [userIsOnline, setUserIsOnline] = useState(navigator.onLine);
  const [alignment, setAlignment] = React.useState("title");
  const [Socket, setSocket] = useState("socket");
  let url = process.env.REACT_APP_URL;

  useEffect(() => {
    // console.log("blog state run first");
    if (localStorage.getItem("Theme")) {
      let getTheme = JSON.parse(localStorage.getItem("Theme"));
      setTheme(getTheme);
    }

    if (localStorage.getItem("user")) {
      // console.log(JSON.parse(localStorage.getItem("user")));
      setLoggedinUser(
        JSON.parse(localStorage.getItem("user")) ||
          JSON.parse(sessionStorage.getItem("user"))
      );
      // console.log(loggedinUser);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("online", () => {
      setUserIsOnline(navigator.onLine);
      // console.log("online", navigator.onLine);
    });
    window.addEventListener("offline", () => {
      setUserIsOnline(navigator.onLine);
      // console.log("offline", navigator.onLine);
    });
    window.addEventListener("offline", userOffline);
    // console.log(navigator.onLine, "changes user online");
    setUserIsOnline(navigator.onLine);
  }, []);

  function userOffline() {
    setUserIsOnline(false);
  }

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
        searchData,
        setSearchData,
        alignment,
        setAlignment,
        search,
        setSearch,
        blog,
        setBlog,
        userIsOnline,
        setUserIsOnline,
        Socket,
        setSocket,
      }}
    >
      {props.children}
    </blogContext.Provider>
  );
};
