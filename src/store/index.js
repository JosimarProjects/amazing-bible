import { configureStore } from '@reduxjs/toolkit';
import bibleReducer from './slices/bibleSlice';

const store = configureStore({
  reducer: {
    bible: bibleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store };
