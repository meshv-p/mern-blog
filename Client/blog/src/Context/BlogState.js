import React, { useState, useEffect } from "react";
import blogContext from "./BlogContext";

export const BlogState = (props) => {
  const [theme, setTheme] = useState(true);
  const [loggedinUser, setLoggedinUser] = useState();
  let url = process.env.REACT_APP_URL;

  useEffect(() => {
    // console.log("blog state run first");
    if (localStorage.getItem("Theme")) {
      let getTheme = JSON.parse(localStorage.getItem("Theme"));
      setTheme(getTheme);
    }

    if (localStorage.getItem("user")) {
      // console.log(JSON.parse(localStorage.getItem("user")));
      setLoggedinUser(JSON.parse(localStorage.getItem("user")));
      // console.log(loggedinUser);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(!theme);
    localStorage.setItem("Theme", !theme);
  };

  return (
    <blogContext.Provider
      value={{ url, theme, toggleTheme, loggedinUser, setLoggedinUser }}
    >
      {props.children}
    </blogContext.Provider>
  );
};
