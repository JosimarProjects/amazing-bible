import React from 'react';
import { Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import Header from './src/components/Header';
import BibleInput from './src/components/BibleInput';

const handleBibleSubmit = (data) => {
  // Exemplo de como utilizar os dados enviados
  Alert.alert("Dados inseridos", JSON.stringify(data));
  console.log(data);
};

function App() {
  return (
    <Provider store={store}>
      <SafeAreaView>
        <Header />
        <BibleInput onSubmit={handleBibleSubmit} />
      </SafeAreaView>
    </Provider>
  );
}

export default App;