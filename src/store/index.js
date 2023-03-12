import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './articleSlice';
import userSlice from './userSlice';

export default configureStore({
  reducer: {
    articles: articleReducer,
    users: userSlice
  }
});
