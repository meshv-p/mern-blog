import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

let url = process.env.REACT_APP_URL || "http://localhost:5000";

export const getBlogs = createAsyncThunk(
  "blogState/getBlogs",
  async (pageNo = 1) => {
    return fetch(`${url}/api/v1/blogs?page=${pageNo}`).then((res) =>
      res.json()
    );
  }
);

export const getBlogById = createAsyncThunk(
  "blogState/getBlogById",
  async (BlogId = 1) => {
    return fetch(`${url}/api/v1/blog/${BlogId}`).then((res) => res.json());
  }
);

export const blogStateSlice = createSlice({
  name: "blogState",
  initialState: {
    blog: [],
    totalPage: 0,
    blogById: [],
    load: false,
  },
  extraReducers: {
    [getBlogs.pending]: (state, action) => {
      state.load = true;
    },

    // [getBlogById.pending]: (state, action) => {
    //   state.load = true;
    // },
    [getBlogs.fulfilled]: (state, action) => {
      state.totalPage = action.payload.length;
      state.blog = [...new Set(state.blog.concat(action.payload.allBlogs))];
    },
    [getBlogById.fulfilled]: (state, action) => {
      // console.log("in id and set", action.payload);
      state.load = false;
      state.blogById = action.payload.findBlog[0];
    },
  },
  reducers: {
    addBlog: (state, action) => {
      //   console.log(action.payload);
      // //   action.payload?.map((obj) => {
      //     return (state.blog += obj);
      //   });
      // let newState = [];
      // console.log(action.payload, typeof action.payload);
      // for (let value of action.payload) {
      //   console.log(value);
      //   newState.push(value);
      // }
      // console.log(newState);
      state.blog = [...new Set(state.blog.concat(action.payload))];
      // state.blog = [...new Set(state.blog)];
      console.log(state.blog);
      // return state.blog;
    },
    decrement: (state) => {
      state.blog -= 1;
    },
    incrementByAmount: (state, action) => {
      state.blog += action.payload;
    },
  },
});
export const { addBlog, decrement, incrementByAmount } = blogStateSlice.actions;

export const incrementAsync = (amount) => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount));
  }, 1000);
};

export default blogStateSlice.reducer;
