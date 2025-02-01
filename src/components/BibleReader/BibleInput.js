import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Dimensions
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentVerse, fetchBibleBooks } from '../store/slices/bibleSlice';

const { width } = Dimensions.get('window');

const BibleInput = () => {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [startVerse, setStartVerse] = useState("");
  const [endVerse, setEndVerse] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [verses, setVerses] = useState([]);
  const [selectedInitialVerse, setSelectedInitialVerse] = useState(null);
  const [selectedFinalVerse, setSelectedFinalVerse] = useState(null);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [availableFinalVerses, setAvailableFinalVerses] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState([]);
  const [showFullScreen, setShowFullScreen] = useState(false);
  
  const dispatch = useDispatch();
  const { books, booksLoading, booksError } = useSelector(state => state.bible);

  useEffect(() => {
    dispatch(fetchBibleBooks());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBook) {
      const chapterArray = Array.from(
        { length: selectedBook.chapters },
        (_, index) => (index + 1).toString()
      );
      setChapters(chapterArray);
    } else {
      setChapters([]);
    }
  }, [selectedBook]);

  useEffect(() => {
    if(selectedBook && chapter){
      fetchVerses(selectedBook.abbrev, chapter);
    } else {
      setVerses([]);
    }
  }, [selectedBook, chapter]);

  const handleInitialVerse = (verseNumber) => {
    if (!verseNumber) {
      setStartVerse('');
      setSelectedInitialVerse(null);
      setSelectedFinalVerse(null);
      setEndVerse('');
      setAvailableFinalVerses([]);
      return;
    }
    
    const verse = verses.find(v => v.number.toString() === verseNumber);
    
    if (verse) {
      setStartVerse(verseNumber);
      setSelectedInitialVerse(verse);
      setSelectedFinalVerse(null);
      setEndVerse('');
      
      const availableVerses = verses.filter(v => v.number >= parseInt(verseNumber));
      setAvailableFinalVerses(availableVerses);
      
      dispatch(setCurrentVerse(verse));
    }
  };

  const handleFinalVerse = (verseNumber) => {
    if (!verseNumber) {
      setEndVerse('');
      setSelectedFinalVerse(null);
      return;
    }
    
    const verse = verses.find(v => v.number.toString() === verseNumber);
    
    if (verse) {
      setEndVerse(verseNumber);
      setSelectedFinalVerse(verse);
      dispatch(setCurrentVerse(verse));
    }
  };

  const fetchVerses = async (bookAbbrev, chapterNumber) => {
    try{
      setLoadingVerses(true);
      const response = await fetch(`https://www.abibliadigital.com.br/api/verses/nvi/${bookAbbrev.pt}/${chapterNumber}`,{
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJUaHUgTWF5IDMwIDIwMjQgMTM6NTc6MzcgR01UKzAwMDAuNjY1ODgzODBmZjA0MWUwMDI4OGEyMTIzIiwiaWF0IjoxNzE3MDc3NDU3fQ.dlAtkD62fcaN6-mgtIGF9_DqoLXliYgLlsd-tIbuTYc`
        }
      });

      const data = await response.json();
      
      if(data.verses) {        
        setVerses(data.verses);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os versículos');
      }

    }catch(error){
      Alert.alert('Erro', 'Não foi possível carregar os versículos');
    }finally{
      setLoadingVerses(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedInitialVerse || !selectedFinalVerse) {
      Alert.alert('Aviso', 'Selecione os versículos inicial e final');
      return;
    }

    setIsSearching(true);
    try {
      const initialNumber = parseInt(selectedInitialVerse.number);
      const finalNumber = parseInt(selectedFinalVerse.number);
      
      const versesInRange = verses.filter(
        verse => verse.number >= initialNumber && verse.number <= finalNumber
      );

      setSelectedVerses(versesInRange);
      setShowFullScreen(true);
    } catch (error) {
      console.error('Erro ao buscar versículos:', error);
      Alert.alert('Erro', 'Erro ao processar os versículos');
    } finally {
      setIsSearching(false);
    }
  };

  const handleBack = () => {
    setShowFullScreen(false);
    setSelectedVerses([]);
  };

  if (booksError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar os livros.</Text>
      </View>
    );
  }

  if (showFullScreen && selectedVerses.length > 0) {
    return (
      <SafeAreaView style={styles.fullScreenContainer}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1470&auto=format&fit=crop' }}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {selectedBook?.name} {chapter}:{selectedInitialVerse?.number}-{selectedFinalVerse?.number}
            </Text>
          </View>
          
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.versesContainer}>
              {selectedVerses.map((verse) => (
                <View key={verse.number} style={styles.verseItem}>
                  <Text style={styles.verseNumber}>{verse.number}</Text>
                  <Text style={styles.verseText}>{verse.text}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1470&auto=format&fit=crop' }}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Sagrada Escritura</Text>
          <Text style={styles.subtitle}>Selecione a passagem desejada</Text>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Livro:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.picker}
                selectedValue={book}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemIndex > 0) {
                    const selectedBook = books[itemIndex - 1];
                    setBook(itemValue);
                    setSelectedBook(selectedBook);
                    setChapter("");
                    
                    // Gera array de capítulos baseado no livro selecionado
                    const chapterArray = Array.from(
                      { length: selectedBook.chapters },
                      (_, index) => (index + 1).toString()
                    );
                    setChapters(chapterArray);
                  } else {
                    setBook("");
                    setSelectedBook(null);
                    setChapter("");
                    setChapters([]);
                  }
                }}
                enabled={!booksLoading}
              >
                <Picker.Item label="Selecione o Livro" value="" />
                {books.map((book) => (
                  <Picker.Item
                    key={book.abbrev.pt}
                    label={book.name}
                    value={book.abbrev.pt}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {chapters.length > 0 && (
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Capítulo:</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={styles.picker}
                  selectedValue={chapter}
                  onValueChange={(itemValue) => {
                    setChapter(itemValue);
                    if (itemValue) {
                      // Limpa os versículos anteriores quando muda o capítulo
                      setVerses([]);
                      setSelectedInitialVerse(null);
                      setSelectedFinalVerse(null);
                      setStartVerse("");
                      setEndVerse("");
                      // Busca os versículos do novo capítulo
                      fetchVerses(selectedBook.abbrev.pt, itemValue);
                    }
                  }}
                  enabled={!!selectedBook}
                >
                  <Picker.Item label="Selecione o Capítulo" value="" />
                  {chapters.map((chapter) => (
                    <Picker.Item
                      key={chapter}
                      label={chapter}
                      value={chapter}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {verses.length > 0 && (
            <>
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Versículo Inicial:</Text>
                <View style={styles.pickerWrapper}>
                  {loadingVerses ? (
                    <ActivityIndicator size="small" color="#4A3C31" />
                  ) : (
                    <Picker
                      style={styles.picker}
                      selectedValue={startVerse}
                      onValueChange={handleInitialVerse}
                      enabled={!loadingVerses}
                    >
                      <Picker.Item label="Selecione" value="" />
                      {verses.map((verse) => (
                        <Picker.Item
                          key={verse.number.toString()}
                          label={verse.number.toString()}
                          value={verse.number.toString()}
                        />
                      ))}
                    </Picker>
                  )}
                </View>
              </View>

              {selectedInitialVerse && (
                <View style={styles.pickerContainer}>
                  <Text style={styles.label}>Versículo Final:</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      style={styles.picker}
                      selectedValue={endVerse}
                      onValueChange={handleFinalVerse}
                      enabled={!loadingVerses && availableFinalVerses.length > 0}
                    >
                      <Picker.Item label="Selecione" value="" />
                      {availableFinalVerses.map((verse) => (
                        <Picker.Item
                          key={verse.number.toString()}
                          label={verse.number.toString()}
                          value={verse.number.toString()}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.searchButton,
                  (!selectedInitialVerse || !selectedFinalVerse) && styles.searchButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!selectedInitialVerse || !selectedFinalVerse}
              >
                {isSearching ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.searchButtonText}>Buscar Versículos</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
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
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
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
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#4A3C31',
    marginBottom: 8,
    fontWeight: '600',
  },
  pickerWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D4C5B9',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  searchButton: {
    backgroundColor: '#4A3C31',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: width * 0.8,
    elevation: 3,
  },
  searchButtonDisabled: {
    backgroundColor: '#A99E97',
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4A3C31',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginRight: 44, // Para compensar o espaço do botão voltar
  },
  scrollContainer: {
    flex: 1,
  },
  versesContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    borderRadius: 15,
    elevation: 3,
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
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BibleInput;
