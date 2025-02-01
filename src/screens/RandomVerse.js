import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from 'react-native';

const RandomVerse = () => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomVerse = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://www.abibliadigital.com.br/api/verses/nvi/random',
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJUaHUgTWF5IDMwIDIwMjQgMTM6NTc6MzcgR01UKzAwMDAuNjY1ODgzODBmZjA0MWUwMDI4OGEyMTIzIiwiaWF0IjoxNzE3MDc3NDU3fQ.dlAtkD62fcaN6-mgtIGF9_DqoLXliYgLlsd-tIbuTYc`
          }
        }
      );
      const data = await response.json();
      setVerse(data);
    } catch (error) {
      console.error('Erro ao buscar versículo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1470&auto=format&fit=crop' }}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Versículo Aleatório</Text>
        <Text style={styles.subtitle}>Deixe Deus falar ao seu coração</Text>

        {verse && (
          <View style={styles.verseContainer}>
            <Text style={styles.verseText}>{verse.text}</Text>
            <Text style={styles.verseReference}>
              {verse.book.name} {verse.chapter}:{verse.number}
            </Text>
            <Text style={styles.bookInfo}>
              Autor: {verse.book.author}
              {'\n'}
              Grupo: {verse.book.group}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={fetchRandomVerse}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>
              {verse ? 'Novo Versículo' : 'Buscar Versículo'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.2,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A3C31',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B5B4F',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  verseContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
    width: '100%',
    elevation: 3,
  },
  verseText: {
    fontSize: 22,
    color: '#2C241D',
    lineHeight: 32,
    marginBottom: 15,
    fontFamily: 'serif',
    textAlign: 'center',
  },
  verseReference: {
    fontSize: 16,
    color: '#4A3C31',
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 10,
  },
  bookInfo: {
    fontSize: 14,
    color: '#6B5B4F',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#4A3C31',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RandomVerse;
