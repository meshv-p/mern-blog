import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
let url = process.env.REACT_APP_URL || "http://localhost:5000";

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "api",
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({
    baseUrl: `${url}/api/v1/`,
  }),
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getBlogs: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: (page = 1) => `/blogs?page=${page}`,
    }),

    getBlog: builder.query({
      query: (postId) => `/blog/${postId}`,
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetBlogsQuery, useGetBlogQuery } = apiSlice;
