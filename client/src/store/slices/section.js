import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchAllSections = createAsyncThunk("section/fetchAllSections", async () => {
    const response = await fetch("http://localhost:9001/api/v1/admin/post/section", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    });
    const data = await response.json();
    return data;
});

const fetchSection = createAsyncThunk("section/fetchSection", async (gameId) => {
    const response = await fetch(`http://localhost:9001/api/v1/data/subject/${gameId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }});
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
            .addCase(fetchAllSections.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllSections.fulfilled, (state, action) => {
                state.loading = false;
                state.section = action.payload.data;
            })
            .addCase(fetchAllSections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchSection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSection.fulfilled, (state, action) => {
                state.loading = false;
                state.section = action.payload.data;
            })
            .addCase(fetchSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export { fetchSection, fetchAllSections };
export default sectionSlice.reducer;