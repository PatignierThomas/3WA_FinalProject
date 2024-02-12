import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: null,
    username: "",
    role: "visitor",
    age: null,
    isLogged: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.role = action.payload.role;
            state.age = action.payload.age;
            state.isLogged = true;
        },
        logout: (state) => {
            state.id = null;
            state.username = "";
            state.role = "visitor";
            state.age = null;
            state.isLogged = false;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;