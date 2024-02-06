import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchGames = createAsyncThunk("games/fetchGames", async () => {
    const response = await fetch("http://localhost:9001/api/v1/data/game", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data;
});

const initialState = {
    games: [],
    loading: false,
    error: null,
};

const gameSlice = createSlice({
    name: "game",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchGames.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGames.fulfilled, (state, action) => {
                state.loading = false;
                state.games = action.payload;
            })
            .addCase(fetchGames.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export { fetchGames };
export default gameSlice.reducer;