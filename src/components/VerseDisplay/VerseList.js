import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const VerseList = ({ verses, bookName, chapter, startVerse, endVerse }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.versesContainer}>
        <Text style={styles.header}>
          {bookName} {chapter}:{startVerse}-{endVerse}
        </Text>
        {verses.map((verse) => (
          <View key={verse.number} style={styles.verseItem}>
            <Text style={styles.verseNumber}>{verse.number}</Text>
            <Text style={styles.verseText}>{verse.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  versesContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    borderRadius: 15,
    elevation: 3,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A3C31',
    marginBottom: 20,
    textAlign: 'center',
  },
  verseItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E0D8',
    paddingBottom: 15,
  },
  verseNumber: {
    fontWeight: 'bold',
    marginRight: 10,
    color: '#4A3C31',
    minWidth: 25,
    fontSize: 16,
  },
  verseText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
    color: '#2C241D',
    fontFamily: 'serif',
  },
});

export default VerseList;
