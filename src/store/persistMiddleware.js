import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = '@AmazingBible:favorites';

export const loadFavorites = async () => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
    return [];
  }
};

export const persistMiddleware = store => next => action => {
  const result = next(action);
  
  if (action.type === 'favorites/addFavorite' || action.type === 'favorites/removeFavorite') {
    const state = store.getState();
    AsyncStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(state.favorites.verses)
    ).catch(error => {
      console.error('Erro ao salvar favoritos:', error);
    });
  }
  
  return result;
};
