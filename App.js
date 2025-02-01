import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import MainScreen from './src/screens/MainScreen';
import { loadFavorites } from './src/store/persistMiddleware';
import { addFavorite } from './src/store/favoritesSlice';

const App = () => {
  useEffect(() => {
    loadFavorites().then(favoritos => {
      favoritos.forEach(versiculo => {
        store.dispatch(addFavorite(versiculo));
      });
    });
  }, []);

  return (
    <Provider store={store}>
      <MainScreen />
    </Provider>
  );
};

export default App;