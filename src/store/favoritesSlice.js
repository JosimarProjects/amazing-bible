import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    verses: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      const verse = action.payload;
      if (!state.verses.some(v => 
        v.book.name === verse.book.name && 
        v.chapter === verse.chapter && 
        v.number === verse.number
      )) {
        state.verses.push(verse);
      }
    },
    removeFavorite: (state, action) => {
      const verse = action.payload;
      state.verses = state.verses.filter(v => 
        !(v.book.name === verse.book.name && 
          v.chapter === verse.chapter && 
          v.number === verse.number)
      );
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
