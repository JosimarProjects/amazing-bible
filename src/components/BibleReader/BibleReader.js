import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentVerse, fetchBibleBooks } from '../../store/slices/bibleSlice';
import BookPicker from '../BibleSelector/BookPicker';
import ChapterPicker from '../BibleSelector/ChapterPicker';
import VersePicker from '../BibleSelector/VersePicker';
import VerseList from '../VerseDisplay/VerseList';

const BibleReader = () => {
  // Estados
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [verses, setVerses] = useState([]);
  const [selectedInitialVerse, setSelectedInitialVerse] = useState(null);
  const [selectedFinalVerse, setSelectedFinalVerse] = useState(null);
  const [startVerse, setStartVerse] = useState("");
  const [endVerse, setEndVerse] = useState("");
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [availableFinalVerses, setAvailableFinalVerses] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState([]);
  const [showFullScreen, setShowFullScreen] = useState(false);

  const dispatch = useDispatch();
  const { books, booksLoading, booksError } = useSelector(state => state.bible);

  // Efeitos
  useEffect(() => {
    dispatch(fetchBibleBooks());
  }, [dispatch]);

  // Funções auxiliares
  const handleBookSelect = (bookValue, bookData) => {
    setBook(bookValue);
    setSelectedBook(bookData);
    setChapter("");
    
    if (bookData) {
      const chapterArray = Array.from(
        { length: bookData.chapters },
        (_, index) => (index + 1).toString()
      );
      setChapters(chapterArray);
    } else {
      setChapters([]);
    }
  };

  const handleChapterSelect = async (chapterValue) => {
    setChapter(chapterValue);
    if (chapterValue && selectedBook) {
      setVerses([]);
      setSelectedInitialVerse(null);
      setSelectedFinalVerse(null);
      setStartVerse("");
      setEndVerse("");
      await fetchVerses(selectedBook.abbrev.pt, chapterValue);
    }
  };

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
    }
  };

  const fetchVerses = async (bookAbbrev, chapterNumber) => {
    try {
      setLoadingVerses(true);
      const response = await fetch(
        `https://www.abibliadigital.com.br/api/verses/nvi/${bookAbbrev}/${chapterNumber}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJUaHUgTWF5IDMwIDIwMjQgMTM6NTc6MzcgR01UKzAwMDAuNjY1ODgzODBmZjA0MWUwMDI4OGEyMTIzIiwiaWF0IjoxNzE3MDc3NDU3fQ.dlAtkD62fcaN6-mgtIGF9_DqoLXliYgLlsd-tIbuTYc`
          }
        }
      );

      const data = await response.json();
      if (data.verses) {
        setVerses(data.verses);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os versículos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os versículos');
    } finally {
      setLoadingVerses(false);
    }
  };

  const handleSearch = async () => {
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
      Alert.alert('Erro', 'Erro ao processar os versículos');
    } finally {
      setIsSearching(false);
    }
  };

  const handleBack = () => {
    setShowFullScreen(false);
    setSelectedVerses([]);
  };

  // Renderização condicional para tela cheia
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
          </View>
          
          <VerseList
            verses={selectedVerses}
            bookName={selectedBook?.name}
            chapter={chapter}
            startVerse={selectedInitialVerse?.number}
            endVerse={selectedFinalVerse?.number}
          />
        </ImageBackground>
      </SafeAreaView>
    );
  }

  // Tela principal
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1470&auto=format&fit=crop' }}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Sagrada Escritura</Text>
          <Text style={styles.subtitle}>Selecione a passagem desejada</Text>

          <BookPicker
            selectedBook={book}
            onBookSelect={handleBookSelect}
            books={books}
            isLoading={booksLoading}
          />

          {chapters.length > 0 && (
            <ChapterPicker
              selectedChapter={chapter}
              onChapterSelect={handleChapterSelect}
              chapters={chapters}
              enabled={!!selectedBook}
            />
          )}

          {verses.length > 0 && (
            <>
              <VersePicker
                label="Versículo Inicial:"
                selectedVerse={startVerse}
                onVerseSelect={handleInitialVerse}
                verses={verses}
                enabled={true}
                isLoading={loadingVerses}
              />

              {selectedInitialVerse && (
                <VersePicker
                  label="Versículo Final:"
                  selectedVerse={endVerse}
                  onVerseSelect={handleFinalVerse}
                  verses={availableFinalVerses}
                  enabled={availableFinalVerses.length > 0}
                  isLoading={loadingVerses}
                />
              )}

              <TouchableOpacity
                style={[
                  styles.searchButton,
                  (!selectedInitialVerse || !selectedFinalVerse) && styles.searchButtonDisabled
                ]}
                onPress={handleSearch}
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
      </View>
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
  searchButton: {
    backgroundColor: '#4A3C31',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '80%',
    elevation: 3,
  },
  searchButtonDisabled: {
    backgroundColor: '#A99E97',
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
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
});

export default BibleReader;
