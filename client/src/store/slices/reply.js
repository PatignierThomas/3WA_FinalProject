import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchReply = createAsyncThunk("post/fetchReply", async (postId) => {
    const response = await fetch(`http://localhost:9001/api/v1/reply/all/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    const result = await response.json();
    console.log(result);
    return result;
});

const initialState = {
    replies: [],
    loading: false,
    error: null,
};

const replySlice = createSlice({
    name: "reply",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchReply.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReply.fulfilled, (state, action) => {
                state.loading = false;
                state.replies = action.payload.data;
            })
            .addCase(fetchReply.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export { fetchReply };
export default replySlice.reducer;