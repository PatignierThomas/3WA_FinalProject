import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
    const response = await fetch("http://localhost:9001/api/v1/data/post", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }});
    const data = await response.json();
    return data;
});

const fetchPost = createAsyncThunk("post/fetchPost", async (id) => {
    const response = await fetch(`http://localhost:9001/api/v1/data/post/${id}`);
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
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
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
            });
    },
});

export { fetchPosts, fetchPost };
export default postSlice.reducer;