import React  from 'react';
import { Text, View, Alert } from 'react-native';
import {
  SafeAreaView,  
 
} from 'react-native';
import  Header  from './src/components/Header';
import BibleInput from './src/components/BibleInput';

const handleBibleSubmit = (data) => {
  // Exemplo de como utilizar os dados enviados
  Alert.alert("Dados inseridos", JSON.stringify(data));
  console.log(data);
};


function App() {
 
  return (
    <SafeAreaView>
        <Header />
        <Text>My Todos</Text>
        <View>
          <BibleInput onSubmit={handleBibleSubmit} />
        </View>
   
    </SafeAreaView>
  );
}



export default App;