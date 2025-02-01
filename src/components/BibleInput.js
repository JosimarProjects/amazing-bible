import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ImageBackground } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentVerse, fetchBibleBooks } from '../store/slices/bibleSlice';
import VerseDisplay from './VerseDisplay';
import { theme } from '../theme';
import { images } from '../theme/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BibleInput = () => {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [startVerse, setStartVerse] = useState("");
  const [endVerse, setEndVerse] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chapterVerses, setChapterVerses] = useState([]);
  const [showVerses, setShowVerses] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState(null);
  
  const dispatch = useDispatch();
  const { books, booksLoading, booksError } = useSelector(state => state.bible);

  useEffect(() => {
    dispatch(fetchBibleBooks());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBook) {
      const chapterArray = Array.from(
        { length: selectedBook.chapters },
        (_, index) => index + 1
      );
      setChapters(chapterArray);
    } else {
      setChapters([]);
    }
  }, [selectedBook]);

  const fetchChapterVerses = async (bookAbbrev, chapter) => {
    try {
      setLoading(true);
      
      const url = `https://www.abibliadigital.com.br/api/verses/nvi/${bookAbbrev}/${chapter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJUaHUgTWF5IDMwIDIwMjQgMTM6NTc6MzcgR01UKzAwMDAuNjY1ODgzODBmZjA0MWUwMDI4OGEyMTIzIiwiaWF0IjoxNzE3MDc3NDU3fQ.dlAtkD62fcaN6-mgtIGF9_DqoLXliYgLlsd-tIbuTYc'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erro na API: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      
      if (!data.verses || !Array.isArray(data.verses)) {
        throw new Error('Formato de dados inválido da API');
      }

      setChapterVerses(data.verses);
      return data.verses;
    } catch (error) {
      Alert.alert(
        "Erro", 
        `Erro ao buscar versículos: ${error.message}\nTente novamente em alguns instantes.`
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (book && chapter) {
      const selectedBookData = books.find(b => b.name === book);
      if (selectedBookData) {
        fetchChapterVerses(selectedBookData.abbrev.pt, chapter);
      }
    } else {
      setChapterVerses([]);
    }
  }, [book, chapter, books]);

  const handleSubmit = () => {
    if (!startVerse || !endVerse) {
      Alert.alert("Erro", "Por favor, selecione os versículos inicial e final.");
      return;
    }

    const start = parseInt(startVerse);
    const end = parseInt(endVerse);

    if (start > end) {
      Alert.alert("Erro", "O versículo inicial não pode ser maior que o versículo final.");
      return;
    }

    const filteredVerses = chapterVerses.filter(
      verse => verse.number >= start && verse.number <= end
    );

    setSelectedVerses(filteredVerses);
    setShowVerses(true);
  };

  if (showVerses && selectedVerses) {
    return (
      <VerseDisplay 
        verses={selectedVerses} 
        onBack={() => {
          setShowVerses(false);
          setSelectedVerses(null);
        }} 
      />
    );
  }

  if (booksError) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert" size={40} color={theme.colors.error} />
        <Text style={styles.errorText}>Erro ao carregar os livros: {booksError}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => dispatch(fetchBibleBooks())}
        >
          <Icon name="refresh" size={20} color={theme.colors.background} />
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ImageBackground 
        source={{ uri: images.backgrounds.bible }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Icon name="book-cross" size={40} color={theme.colors.primary} style={styles.headerIcon} />
              <Text style={styles.title}>Bíblia Sagrada</Text>
            </View>

            <View style={styles.inputSection}>
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Icon name="book-open-page-variant" size={20} color={theme.colors.primary} />
                  <Text style={styles.label}>Livro</Text>
                </View>
                <View style={styles.pickerContainer}>
                  {booksLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  ) : (
                    <Picker
                      selectedValue={book}
                      onValueChange={(itemValue) => {
                        const foundBook = books.find(b => b.name === itemValue);
                        setBook(itemValue);
                        setSelectedBook(foundBook);
                        setChapter("");
                        setStartVerse("");
                        setEndVerse("");
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Selecione um livro" value="" color={theme.colors.text} />
                      {books.map((book) => (
                        <Picker.Item 
                          key={book.abbrev.pt} 
                          label={book.name} 
                          value={book.name}
                          color={theme.colors.text}
                        />
                      ))}
                    </Picker>
                  )}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Icon name="numeric" size={20} color={theme.colors.primary} />
                  <Text style={styles.label}>Capítulo</Text>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={chapter}
                    onValueChange={(value) => {
                      setChapter(value);
                      setStartVerse("");
                      setEndVerse("");
                    }}
                    style={styles.picker}
                    enabled={!!selectedBook}
                  >
                    <Picker.Item label="Selecione um capítulo" value="" color={theme.colors.text} />
                    {chapters.map((num) => (
                      <Picker.Item 
                        key={num.toString()} 
                        label={num.toString()} 
                        value={num.toString()}
                        color={theme.colors.text}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.verseSelectionContainer}>
                <View style={styles.verseInputGroup}>
                  <View style={styles.labelContainer}>
                    <Icon name="format-quote-open" size={20} color={theme.colors.primary} />
                    <Text style={styles.label}>Do versículo</Text>
                  </View>
                  <View style={[styles.pickerContainer, styles.versePickerContainer]}>
                    <Picker
                      selectedValue={startVerse}
                      onValueChange={(value) => {
                        setStartVerse(value);
                      }}
                      style={styles.picker}
                      enabled={!!chapter && chapterVerses.length > 0}
                    >
                      <Picker.Item label="Início" value="" color={theme.colors.text} />
                      {chapterVerses.map((verse) => (
                        <Picker.Item 
                          key={verse.number.toString()} 
                          label={verse.number.toString()} 
                          value={verse.number.toString()}
                          color={theme.colors.text}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.verseInputGroup}>
                  <View style={styles.labelContainer}>
                    <Icon name="format-quote-close" size={20} color={theme.colors.primary} />
                    <Text style={styles.label}>Até o versículo</Text>
                  </View>
                  <View style={[styles.pickerContainer, styles.versePickerContainer]}>
                    <Picker
                      selectedValue={endVerse}
                      onValueChange={(value) => {
                        setEndVerse(value);
                      }}
                      style={styles.picker}
                      enabled={!!startVerse}
                    >
                      <Picker.Item label="Fim" value="" color={theme.colors.text} />
                      {chapterVerses
                        .filter(verse => verse.number >= parseInt(startVerse || "0"))
                        .map((verse) => (
                          <Picker.Item 
                            key={verse.number.toString()} 
                            label={verse.number.toString()} 
                            value={verse.number.toString()}
                            color={theme.colors.text}
                          />
                        ))}
                    </Picker>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={[
                  styles.searchButton,
                  (loading || !startVerse || !endVerse) && styles.searchButtonDisabled
                ]} 
                onPress={handleSubmit}
                disabled={loading || !startVerse || !endVerse}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={theme.colors.background} />
                ) : (
                  <>
                    <Icon name="book-search" size={24} color={theme.colors.background} />
                    <Text style={styles.searchButtonText}>Buscar Versículos</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  headerIcon: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  inputSection: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  verseSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  verseInputGroup: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  pickerContainer: {
    borderColor: theme.colors.divider,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    ...theme.shadows.light,
    overflow: 'hidden',
  },
  versePickerContainer: {
    minWidth: 100,
  },
  picker: {
    height: 50,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    ...theme.shadows.medium,
  },
  searchButtonDisabled: {
    backgroundColor: theme.colors.divider,
    opacity: 0.7,
  },
  searchButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    marginLeft: theme.spacing.sm,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
    fontFamily: theme.fonts.medium,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.medium,
  },
  retryButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.fonts.medium,
  },
});

export default BibleInput;
