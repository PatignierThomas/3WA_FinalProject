import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";

const checkToken = createAsyncThunk("checkToken/checkToken", async () => {
    const res = await fetch('http://localhost:9001/api/v1/auth/check-token', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    const result = await res.json();
    return result;
})

const initialState = {
    data: {},
    message: "",
    loading: false,
    error: null,
};  

const checkTokenSlice = createSlice({
    name: "checkToken",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(checkToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkToken.fulfilled, (state, action) => {
                if (action.payload.data) {
                    state.data = action.payload.data;
                    state.message = action.payload.message;
                } else {
                    state.data = {};
                    state.message = action.payload.message;
                }
                state.loading = false;
            })
            .addCase(checkToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
});

export default checkTokenSlice.reducer;

export { checkToken };