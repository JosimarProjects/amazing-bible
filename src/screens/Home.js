import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import BibleInput from '../components/BibleInput';

const Home = () => {
  const handleBibleSubmit = (data) => {
    console.log('Dados inseridos:', data);
  };

  return (
    <View style={styles.container}>
      <Header />
      <BibleInput onSubmit={handleBibleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Home;
