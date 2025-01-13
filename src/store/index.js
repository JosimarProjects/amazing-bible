import { configureStore } from '@reduxjs/toolkit';
import bibleReducer from './slices/bibleSlice';

export const store = configureStore({
  reducer: {
    bible: bibleReducer,
  },
});
