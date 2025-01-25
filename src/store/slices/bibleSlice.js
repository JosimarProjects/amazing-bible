import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_CONFIG, getApiHeaders } from '../../config/api';

export const fetchBibleBooks = createAsyncThunk(
  'bible/fetchBooks',
  async () => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/books`, {
      headers: getApiHeaders()
    });
    if (!response.ok) {
      throw new Error('Falha ao carregar os livros');
    }
    return response.json();
  }
);

const initialState = {
  currentVerse: null,
  verseHistory: [],
  favorites: [],
  books: [],
  booksLoading: false,
  booksError: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchBibleBooks.pending, (state) => {
        state.booksLoading = true;
        state.booksError = null;
      })
      .addCase(fetchBibleBooks.fulfilled, (state, action) => {
        state.booksLoading = false;
        state.books = action.payload;
      })
      .addCase(fetchBibleBooks.rejected, (state, action) => {
        state.booksLoading = false;
        state.booksError = action.error.message;
      });
  },
});

export const { setCurrentVerse, addToFavorites, removeFromFavorites } = bibleSlice.actions;

export default bibleSlice.reducer;
