import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert, ActivityIndicator } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentVerse, fetchBibleBooks } from '../store/slices/bibleSlice';

const BibleInput = () => {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [startVerse, setStartVerse] = useState("");
  const [endVerse, setEndVerse] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  
  const dispatch = useDispatch();
  const { books, booksLoading, booksError } = useSelector(state => state.bible);

  useEffect(() => {
    dispatch(fetchBibleBooks());
  }, [dispatch]);

  // Atualiza os capítulos quando um livro é selecionado
  useEffect(() => {
    if (selectedBook) {
      const chapterArray = Array.from(
        { length: selectedBook.chapters },
        (_, index) => index + 1
      );
      setChapters(chapterArray);
      console.warn('Livro selecionado:', selectedBook.name, 'Capítulos:', chapterArray.length);
    } else {
      setChapters([]);
    }
  }, [selectedBook]);

  const handleSubmit = () => {
    if (!book || !chapter || !startVerse || !endVerse) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (isNaN(chapter) || isNaN(startVerse) || isNaN(endVerse)) {
      Alert.alert("Erro", "Capítulo e versículos devem ser números.");
      return;
    }

    if (parseInt(startVerse) > parseInt(endVerse)) {
      Alert.alert("Erro", "O versículo inicial não pode ser maior que o versículo final.");
      return;
    }

    const verseData = {
      book: book.trim(),
      chapter: parseInt(chapter),
      startVerse: parseInt(startVerse),
      endVerse: parseInt(endVerse),
    };

    dispatch(setCurrentVerse(verseData));
  };

  if (booksError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar os livros: {booksError}</Text>
        <Button title="Tentar Novamente" onPress={() => dispatch(fetchBibleBooks())} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Livro:</Text>
      <View style={styles.pickerContainer}>
        {booksLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Picker
            selectedValue={book}
            onValueChange={(itemValue) => {
              const foundBook = books.find(b => b.name === itemValue);
              setBook(itemValue);
              setSelectedBook(foundBook);
              setChapter("");
            }}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um livro" value="" />
            {books.map((book) => (
              <Picker.Item 
                key={book.abbrev.pt} 
                label={book.name} 
                value={book.name}
              />
            ))}
          </Picker>
        )}
      </View>

      <Text style={styles.label}>Capítulo:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={chapter}
          onValueChange={setChapter}
          style={styles.picker}
          enabled={!!selectedBook}
        >
          <Picker.Item label="Selecione um capítulo" value="" />
          {chapters.map((num) => (
            <Picker.Item 
              key={num.toString()} 
              label={num.toString()} 
              value={num.toString()}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Do versículo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 1"
        value={startVerse}
        onChangeText={setStartVerse}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Até o versículo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 5"
        value={endVerse}
        onChangeText={setEndVerse}
        keyboardType="numeric"
      />

      <Button title="Buscar Versículos" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    minHeight: 50,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default BibleInput;
