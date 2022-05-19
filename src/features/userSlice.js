import { createSlice } from "@reduxjs/toolkit";

let user = JSON.parse(localStorage.getItem("user"))?.profile;

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: user ? user : null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    // getUser: (state) => {
    //   state.count
    // },
  },
});
export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
