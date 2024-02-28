import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";

const placeholder = createAsyncThunk("checkToken/checkToken", async () => {})

const initialState = {
    isLogged: false,
    loading: false,
    error: null,
};  

const placegolderSlice = createSlice({
    name: "checkToken",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(placeholder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(placeholder.fulfilled, (state) => {
                state.loading = false;
                state.isLogged = true;
            })
            .addCase(placeholder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
});

export default placegolderSlice.reducer;

export { placeholder };