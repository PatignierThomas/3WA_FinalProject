import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user';
import postReducer from './slices/post';
import sectionReducer from './slices/section';
import gameReducer from './slices/game';
import replyReducer from './slices/reply';

const store = configureStore({
    reducer: {
        user: userReducer,
        post: postReducer,
        section: sectionReducer,
        game: gameReducer,
        reply: replyReducer

    },
});

export {store};