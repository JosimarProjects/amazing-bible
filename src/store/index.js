import { configureStore } from '@reduxjs/toolkit';
import bibleReducer from './slices/bibleSlice';
import favoritesReducer from './favoritesSlice';
import { persistMiddleware } from './persistMiddleware';

export const store = configureStore({
  reducer: {
    bible: bibleReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(persistMiddleware),
});
