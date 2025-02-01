import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import TabNavigator from '../navigation/TabNavigator';
import RandomVerse from './RandomVerse';
import Header from '../components/Header';
import BibleInput from '../components/BibleInput';
import FavoriteVerses from './FavoriteVerses';

const MainScreen = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleBibleSubmit = (data) => {
    Alert.alert("Dados inseridos", JSON.stringify(data));
    console.log(data);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <View style={styles.content}>
            <Header />
            <BibleInput onSubmit={handleBibleSubmit} />
          </View>
        );
      case 'random':
        return <RandomVerse />;
      case 'favorites':
        return <FavoriteVerses />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>
      <TabNavigator activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});

export default MainScreen;
