import React, { useState, useEffect } from "react";
import blogContext from "./BlogContext";
import { createTheme } from "@mui/material/styles";

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

  const darkTheme = createTheme({
    palette: {
      mode: theme ? "light" : "dark",
      primary: {
        main: "#1976d2",
      },
    },
  });

  let value = {
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
    darkTheme,
  };

  return (
    <blogContext.Provider value={value}>{props.children}</blogContext.Provider>
  );
};
