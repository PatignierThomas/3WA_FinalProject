import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchSection = createAsyncThunk("section/fetchSection", async () => {
    const response = await fetch("http://localhost:9001/api/v1/data/subject");
    const data = await response.json();
    return data;
});

const initialState = {
    section: [],
    loading: false,
    error: null,
};

const sectionSlice = createSlice({
    name: "section",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchSection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSection.fulfilled, (state, action) => {
                state.loading = false;
                state.section = action.payload;
            })
            .addCase(fetchSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export { fetchSection };
export default sectionSlice.reducer;