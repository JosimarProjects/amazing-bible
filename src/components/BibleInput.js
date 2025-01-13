import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert } from "react-native";

const BibleInput = ({ onSubmit }) => {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [startVerse, setStartVerse] = useState("");
  const [endVerse, setEndVerse] = useState("");

  const handleSubmit = () => {
    // Validação básica
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

    // Chama a função de callback passada como prop
    onSubmit({
      book: book.trim(),
      chapter: parseInt(chapter),
      startVerse: parseInt(startVerse),
      endVerse: parseInt(endVerse),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Livro:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Gênesis"
        value={book}
        onChangeText={setBook}
      />

      <Text style={styles.label}>Capítulo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 1"
        value={chapter}
        onChangeText={setChapter}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Versículo Inicial:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 1"
        value={startVerse}
        onChangeText={setStartVerse}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Versículo Final:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 5"
        value={endVerse}
        onChangeText={setEndVerse}
        keyboardType="numeric"
      />

      <Button title="Enviar" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});

export default BibleInput;
