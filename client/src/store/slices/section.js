import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchPosts = createAsyncThunk("post/fetchSection", async () => {
    const response = await fetch("http://localhost:9001/api/v1/data/subject");
    const data = await response.json();
    return data;
});

const initialState = {
    section: [],
    loading: false,
    error: null,
};

const postSlice = createSlice({
    name: "section",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.section = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const postActions = { fetchPosts };
export default postSlice.reducer;