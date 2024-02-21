import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {},
    isLogged: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isLogged = true;
        },
        logout: (state) => {
            state.user = {};
            state.isLogged = false;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;