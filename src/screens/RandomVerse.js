import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Share,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { requestStoragePermissions } from '../utils/permissions';

const RandomVerse = () => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.verses);

  const openSettings = async () => {
    if (Platform.OS === 'android') {
      try {
        await Linking.openSettings();
      } catch (error) {
        console.error('Erro ao abrir configurações:', error);
      }
    }
  };

  const handlePermissionDenied = () => {
    Alert.alert(
      'Permissão Necessária',
      'Para usar esta função, precisamos da sua permissão. Deseja abrir as configurações do app?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Abrir Configurações',
          onPress: openSettings,
        },
      ],
    );
  };

  const isVerseFavorite = (verse) => {
    if (!verse) return false;
    return favorites.some(v => 
      v.book.name === verse.book.name && 
      v.chapter === verse.chapter && 
      v.number === verse.number
    );
  };

  const fetchRandomVerse = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://www.abibliadigital.com.br/api/verses/nvi/random',
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJUaHUgTWF5IDMwIDIwMjQgMTM6NTc6MzcgR01UKzAwMDAuNjY1ODgzODBmZjA0MWUwMDI4OGEyMTIzIiwiaWF0IjoxNzE3MDc3NDU3fQ.dlAtkD62fcaN6-mgtIGF9_DqoLXliYgLlsd-tIbuTYc'
          }
        }
      );
      const data = await response.json();
      setVerse(data);
    } catch (error) {
      console.error('Erro ao buscar versículo:', error);
      Alert.alert('Erro', 'Não foi possível buscar um novo versículo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!verse) return;

    try {
      const message = `"${verse.text}"\n\n${verse.book.name} ${verse.chapter}:${verse.number}`;
      const result = await Share.share({
        message,
        title: 'Compartilhar Versículo',
      });
      
      if (result.action === Share.sharedAction) {
        console.log('Compartilhado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o versículo. Tente novamente.');
    }
  };

  const toggleFavorite = async () => {
    if (!verse) return;

    const hasPermission = await requestStoragePermissions();
    if (!hasPermission) {
      handlePermissionDenied();
      return;
    }

    if (isVerseFavorite(verse)) {
      dispatch(removeFavorite(verse));
      Alert.alert('Sucesso', 'Versículo removido dos favoritos!');
    } else {
      dispatch(addFavorite(verse));
      Alert.alert('Sucesso', 'Versículo adicionado aos favoritos!');
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
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={handleShare}
                style={styles.actionButton}
              >
                <Icon name="share" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleFavorite}
                style={styles.actionButton}
              >
                <Icon
                  name={isVerseFavorite(verse) ? "favorite" : "favorite-border"}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={fetchRandomVerse}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {verse ? 'Próximo Versículo' : 'Buscar Versículo'}
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
    opacity: 0.7,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  verseContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  verseText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
    marginBottom: 16,
  },
  verseReference: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#6B4EFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  actionButton: {
    marginLeft: 16,
    backgroundColor: '#6B4EFF',
    padding: 8,
    borderRadius: 20,
  },
});

export default RandomVerse;
