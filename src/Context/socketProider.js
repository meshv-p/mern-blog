import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    // console.log(user);
    if (user) {
      const newSocket = io(process.env.URL, {
        // reconnectionDelayMax: 10000,
        // auth: {
        //   token: "123",
        // },
        query: {
          id: user.profile._id,
          name: user.profile.username,
        },
      });

      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

// export const SocketContext = createContext();
// //implement the socket.io
// export const socket = io("http://localhost:5001", {
//   // reconnectionDelayMax: 10000,
//   // auth: {
//   //   token: "123",
//   // },
//   query: {
//     id: JSON.parse(localStorage.getItem("user")).profile._id,
//     name: JSON.parse(localStorage.getItem("user")).profile.username,
//   },
// });
