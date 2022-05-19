import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/apiSlice";
import blogStateSlice from "../features/blogStateSlice";
import counterSlice from "../features/counterSlice";
import userSlice from "../features/userSlice";

export default configureStore({
  reducer: {
    user: userSlice,
    count: counterSlice,
    blog: blogStateSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(apiSlice.middleware),
});
