import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentVerse: null,
  verseHistory: [],
  favorites: [],
};

export const bibleSlice = createSlice({
  name: 'bible',
  initialState,
  reducers: {
    setCurrentVerse: (state, action) => {
      state.currentVerse = action.payload;
      state.verseHistory.push(action.payload);
    },
    addToFavorites: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(verse => 
        verse.reference !== action.payload.reference
      );
    },
  },
});

export const { setCurrentVerse, addToFavorites, removeFromFavorites } = bibleSlice.actions;

export default bibleSlice.reducer;
