import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: "",
    isLogged: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.username = action.payload.username;
            state.isLogged = true;
        },
        logout: (state) => {
            state.username = "";
            state.isLogged = false;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;