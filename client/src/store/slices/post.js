import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchPostsBySection = createAsyncThunk("post/fetchPosts", async ({sectionId, currentPage, postsPerPage}) => {
    const response = await fetch(`http://localhost:9001/api/v1/post/section/${sectionId}?page=${currentPage}&limit=${postsPerPage}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    const data = await response.json();
    return data;
});

const fetchPost = createAsyncThunk("post/fetchPost", async (id) => {
    const response = await fetch(`http://localhost:9001/api/v1/post/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            },
        credentials: "include",
     });
    const data = await response.json();
    return data;
});

const mostRecentPost = createAsyncThunk("post/mostRecentPost", async (gameId) => {
    const response = await fetch(`http://localhost:9001/api/v1/post/recent/${gameId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    const data = await response.json();
    return data;
});

const initialState = {
    posts: [],
    total: 0,
    loading: false,
    error: null,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostsBySection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPostsBySection.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload.data.posts;
                state.total = action.payload.data.total;
            })
            .addCase(fetchPostsBySection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload.data;
            })
            .addCase(fetchPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(mostRecentPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mostRecentPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload.data;
            })
            .addCase(mostRecentPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export { fetchPostsBySection, fetchPost, mostRecentPost };
export default postSlice.reducer;