import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Share,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { removeFavorite } from '../store/favoritesSlice';

const FavoriteVerses = () => {
  const favorites = useSelector(state => state.favorites.verses);
  const dispatch = useDispatch();

  const openSettings = async () => {
    if (Platform.OS === 'android') {
      try {
        await Linking.openSettings();
      } catch (error) {
        console.error('Erro ao abrir configurações:', error);
      }
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      const hasPermission = await PermissionsAndroid.check(permission);
      
      if (hasPermission) return true;

      const granted = await PermissionsAndroid.request(permission, {
        title: 'Permissão Necessária',
        message: 'Para compartilhar versículos, precisamos da sua permissão.',
        buttonNeutral: null,
        buttonNegative: 'Negar',
        buttonPositive: 'Permitir',
      });

      if (granted === PermissionsAndroid.RESULTS.DENIED) {
        Alert.alert(
          'Permissão Necessária',
          'Para compartilhar versículos, precisamos da sua permissão. Deseja abrir as configurações do app?',
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
        return false;
      }

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleShare = async (verse) => {
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

  const handleRemoveFavorite = (verse) => {
    Alert.alert(
      'Remover dos Favoritos',
      'Tem certeza que deseja remover este versículo dos favoritos?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          onPress: () => {
            dispatch(removeFavorite(verse));
            Alert.alert('Sucesso', 'Versículo removido dos favoritos!');
          },
          style: 'destructive',
        },
      ],
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.verseContainer}>
      <View style={styles.verseContent}>
        <Text style={styles.verseText}>"{item.text}"</Text>
        <Text style={styles.reference}>
          {item.book.name} {item.chapter}:{item.number}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleShare(item)}
          style={styles.actionButton}
        >
          <Icon name="share" size={24} color="#6B4EFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRemoveFavorite(item)}
          style={styles.actionButton}
        >
          <Icon name="favorite" size={24} color="#FF4E4E" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Versículos Favoritos</Text>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="favorite-border" size={48} color="#ccc" />
          <Text style={styles.emptyText}>
            Você ainda não tem versículos favoritos.
          </Text>
          <Text style={styles.emptySubtext}>
            Adicione versículos aos favoritos na tela de versículos aleatórios!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item, index) => 
            `${item.book.name}-${item.chapter}-${item.number}-${index}`
          }
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  verseContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  verseContent: {
    marginBottom: 8,
  },
  verseText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 8,
  },
  reference: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default FavoriteVerses;
