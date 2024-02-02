import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user';
import postReducer from './slices/post';
import sectionReducer from './slices/section';
import gameReducer from './slices/game';

const store = configureStore({
    reducer: {
        // Add reducers here
        user: userReducer,
        post: postReducer,
        section: sectionReducer,
        game: gameReducer
    },
});

export {store};