import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchPostsBySection = createAsyncThunk("post/fetchPosts", async (sectionId) => {
    const response = await fetch(`http://localhost:9001/api/v1/data/post/section/${sectionId}`, {
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
    const response = await fetch(`http://localhost:9001/api/v1/data/post/${id}`);
    const data = await response.json();
    return data;
});

const mostRecentPost = createAsyncThunk("post/mostRecentPost", async (gameId) => {
    const response = await fetch(`http://localhost:9001/api/v1/data/get/most/recent/post/${gameId}`, {
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
                state.posts = action.payload;
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
                state.posts = action.payload;
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
                state.posts = action.payload;
            })
            .addCase(mostRecentPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export { fetchPostsBySection, fetchPost, mostRecentPost };
export default postSlice.reducer;